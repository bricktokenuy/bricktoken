-- BrickToken - Atomic token reservation
-- Fixes race condition on properties.tokens_sold (two concurrent buys could oversell).
-- Replaces the read-then-write pattern in the purchase / webhook flows with a single
-- atomic conditional UPDATE that can never push tokens_sold past total_tokens.

CREATE OR REPLACE FUNCTION reserve_property_tokens(
  p_property_id UUID,
  p_tokens INTEGER
)
RETURNS TABLE (
  reserved BOOLEAN,
  tokens_sold INTEGER,
  total_tokens INTEGER,
  tokens_available INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row properties%ROWTYPE;
BEGIN
  IF p_tokens IS NULL OR p_tokens < 1 THEN
    RAISE EXCEPTION 'p_tokens must be a positive integer, got %', p_tokens
      USING ERRCODE = '22023';
  END IF;

  -- Atomic guarded increment: only succeeds if there is enough stock.
  -- The WHERE clause + RETURNING makes the read-modify-write a single statement,
  -- so two concurrent calls serialize on the row lock and can never oversell.
  UPDATE properties
    SET tokens_sold = properties.tokens_sold + p_tokens
    WHERE properties.id = p_property_id
      AND properties.tokens_sold + p_tokens <= properties.total_tokens
    RETURNING * INTO v_row;

  IF FOUND THEN
    reserved := TRUE;
    tokens_sold := v_row.tokens_sold;
    total_tokens := v_row.total_tokens;
    tokens_available := v_row.total_tokens - v_row.tokens_sold;
    RETURN NEXT;
    RETURN;
  END IF;

  -- Not reserved: either the property does not exist or there is not enough stock.
  -- Report current state so the caller can build a clean 409 message.
  SELECT * INTO v_row FROM properties WHERE id = p_property_id;

  IF NOT FOUND THEN
    reserved := FALSE;
    tokens_sold := NULL;
    total_tokens := NULL;
    tokens_available := NULL;
    RETURN NEXT;
    RETURN;
  END IF;

  reserved := FALSE;
  tokens_sold := v_row.tokens_sold;
  total_tokens := v_row.total_tokens;
  tokens_available := v_row.total_tokens - v_row.tokens_sold;
  RETURN NEXT;
  RETURN;
END;
$$;

-- Only the service role (used by the webhook) and authenticated users (mock-mode
-- purchase path) may call it. The function itself is the sole guard on the counter.
REVOKE ALL ON FUNCTION reserve_property_tokens(UUID, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION reserve_property_tokens(UUID, INTEGER) TO authenticated, service_role;
