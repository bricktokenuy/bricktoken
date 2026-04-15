-- Payments table: tracks MercadoPago (or mock) payment lifecycle
-- Run this migration against your Supabase database

CREATE TABLE IF NOT EXISTS payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id uuid REFERENCES transactions(id) NOT NULL,
  investor_id uuid REFERENCES investors(id) NOT NULL,
  external_id text,                -- MercadoPago payment ID
  provider text DEFAULT 'mercadopago',
  amount numeric(12,2) NOT NULL,
  fee numeric(12,2) NOT NULL DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for looking up payments by transaction
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);

-- Index for looking up payments by external (MercadoPago) ID
CREATE INDEX IF NOT EXISTS idx_payments_external_id ON payments(external_id);

-- Index for looking up payments by investor
CREATE INDEX IF NOT EXISTS idx_payments_investor_id ON payments(investor_id);

-- RLS policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Investors can read their own payments
CREATE POLICY "Investors can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = investor_id);

-- Only service role (webhooks) can insert/update payments
CREATE POLICY "Service role can manage payments"
  ON payments FOR ALL
  USING (auth.role() = 'service_role');
