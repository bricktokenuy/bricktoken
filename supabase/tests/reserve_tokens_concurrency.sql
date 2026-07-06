-- Concurrency test for reserve_property_tokens().
-- Run AFTER applying migration 20260705000000_reserve_tokens_rpc.sql.
--
-- Goal: prove that two concurrent reservations that together exceed remaining
-- stock cannot both succeed (no oversell).
--
-- How to run (needs two psql sessions, or the Supabase SQL editor twice):
--
--   SESSION A                              SESSION B
--   ---------                              ---------
--   BEGIN;
--   SELECT * FROM reserve_property_tokens( -- reserves, holds row lock
--     '<PROP_ID>', 6);
--                                          BEGIN;
--                                          SELECT * FROM reserve_property_tokens(
--                                            '<PROP_ID>', 6);  -- BLOCKS on lock
--   COMMIT;
--                                          -- unblocks: re-evaluates guard,
--                                          -- returns reserved = false
--                                          COMMIT;
--
-- Expectation for a property with total_tokens=10, tokens_sold=0:
--   Session A -> reserved = true,  tokens_sold = 6
--   Session B -> reserved = false, tokens_sold = 6, tokens_available = 4
--   Final tokens_sold = 6 (NEVER 12).

-- Single-session sanity checks (safe to run standalone against a scratch row):
DO $$
DECLARE
  v_prop UUID;
  r RECORD;
BEGIN
  INSERT INTO properties (
    name, slug, description, location, department, address,
    total_value, token_price, total_tokens, tokens_sold,
    status, property_type, area_m2
  ) VALUES (
    'TEST reserve', 'test-reserve-' || gen_random_uuid(), '', 'x', 'x', 'x',
    100000, 100, 10, 0, 'funding', 'apartment', 50
  ) RETURNING id INTO v_prop;

  -- 1) Reserve 6 of 10 -> ok
  SELECT * INTO r FROM reserve_property_tokens(v_prop, 6);
  ASSERT r.reserved = true AND r.tokens_sold = 6, 'expected reserve 6 to succeed';

  -- 2) Reserve 6 more (would total 12 > 10) -> rejected, counter unchanged
  SELECT * INTO r FROM reserve_property_tokens(v_prop, 6);
  ASSERT r.reserved = false AND r.tokens_sold = 6 AND r.tokens_available = 4,
    'expected second reserve to fail without changing the counter';

  -- 3) Reserve exactly the remaining 4 -> ok, now full
  SELECT * INTO r FROM reserve_property_tokens(v_prop, 4);
  ASSERT r.reserved = true AND r.tokens_sold = 10 AND r.tokens_available = 0,
    'expected reserving the last 4 to succeed';

  -- 4) Any further reserve -> rejected
  SELECT * INTO r FROM reserve_property_tokens(v_prop, 1);
  ASSERT r.reserved = false AND r.tokens_sold = 10, 'expected sold-out rejection';

  DELETE FROM properties WHERE id = v_prop;
  RAISE NOTICE 'reserve_property_tokens single-session checks PASSED';
END $$;
