-- BrickToken - Initial Schema
-- Tokenización inmobiliaria en Uruguay

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE property_status AS ENUM ('coming_soon', 'funding', 'funded', 'renting', 'closed');
CREATE TYPE property_type AS ENUM ('apartment', 'house', 'land', 'commercial');
CREATE TYPE kyc_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE transaction_type AS ENUM ('buy', 'sell', 'yield');
CREATE TYPE transaction_status AS ENUM ('pending', 'confirmed', 'failed');
CREATE TYPE holding_status AS ENUM ('active', 'sold', 'pending');
CREATE TYPE distribution_status AS ENUM ('pending', 'distributed');
CREATE TYPE document_type AS ENUM ('CI', 'Pasaporte', 'DNI');

-- ============================================================
-- INVESTORS (extends auth.users)
-- ============================================================
CREATE TABLE investors (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  document_type document_type NOT NULL DEFAULT 'CI',
  document_number TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Uruguay',
  wallet_address TEXT,
  kyc_status kyc_status NOT NULL DEFAULT 'pending',
  accredited BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PROPERTIES
-- ============================================================
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL,
  department TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  total_value NUMERIC(14,2) NOT NULL,
  token_price NUMERIC(10,2) NOT NULL,
  total_tokens INTEGER NOT NULL,
  tokens_sold INTEGER NOT NULL DEFAULT 0,
  annual_yield_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  status property_status NOT NULL DEFAULT 'coming_soon',
  property_type property_type NOT NULL,
  bedrooms SMALLINT,
  bathrooms SMALLINT,
  area_m2 NUMERIC(10,2) NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  documents JSONB NOT NULL DEFAULT '[]',
  fideicomiso_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- HOLDINGS
-- ============================================================
CREATE TABLE holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tokens INTEGER NOT NULL CHECK (tokens > 0),
  purchase_price NUMERIC(10,2) NOT NULL,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tx_signature TEXT,
  status holding_status NOT NULL DEFAULT 'active',
  UNIQUE (investor_id, property_id, purchased_at)
);

-- ============================================================
-- DISTRIBUTIONS (yield payouts per property per period)
-- ============================================================
CREATE TABLE distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  period TEXT NOT NULL,
  total_amount NUMERIC(14,2) NOT NULL,
  per_token_amount NUMERIC(10,4) NOT NULL,
  distributed_at TIMESTAMPTZ,
  status distribution_status NOT NULL DEFAULT 'pending',
  UNIQUE (property_id, period)
);

-- ============================================================
-- TRANSACTIONS
-- ============================================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  tokens INTEGER NOT NULL DEFAULT 0,
  amount NUMERIC(14,2) NOT NULL,
  fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  tx_signature TEXT,
  status transaction_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_department ON properties(department);
CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_holdings_investor ON holdings(investor_id);
CREATE INDEX idx_holdings_property ON holdings(property_id);
CREATE INDEX idx_transactions_investor ON transactions(investor_id);
CREATE INDEX idx_transactions_property ON transactions(property_id);
CREATE INDEX idx_distributions_property ON distributions(property_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Properties: public read, admin write
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "properties_public_read"
  ON properties FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "properties_admin_insert"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM investors WHERE id = auth.uid() AND accredited = true)
  );

CREATE POLICY "properties_admin_update"
  ON properties FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM investors WHERE id = auth.uid() AND accredited = true)
  );

-- Investors: own row only
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "investors_own_read"
  ON investors FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "investors_own_insert"
  ON investors FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "investors_own_update"
  ON investors FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Admin can read all investors
CREATE POLICY "investors_admin_read"
  ON investors FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM investors WHERE id = auth.uid() AND accredited = true)
  );

-- Holdings: own rows only
ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "holdings_own_read"
  ON holdings FOR SELECT
  TO authenticated
  USING (investor_id = auth.uid());

CREATE POLICY "holdings_system_insert"
  ON holdings FOR INSERT
  TO authenticated
  WITH CHECK (investor_id = auth.uid());

-- Transactions: own rows only
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_own_read"
  ON transactions FOR SELECT
  TO authenticated
  USING (investor_id = auth.uid());

CREATE POLICY "transactions_system_insert"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (investor_id = auth.uid());

-- Distributions: public read
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "distributions_public_read"
  ON distributions FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================================
-- STORAGE: Property images & documents
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-assets', 'property-assets', true);

CREATE POLICY "property_assets_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'property-assets');

CREATE POLICY "property_assets_admin_upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-assets'
    AND EXISTS (SELECT 1 FROM investors WHERE id = auth.uid() AND accredited = true)
  );

CREATE POLICY "property_assets_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-assets'
    AND EXISTS (SELECT 1 FROM investors WHERE id = auth.uid() AND accredited = true)
  );
