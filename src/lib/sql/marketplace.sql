-- Secondary Marketplace tables for BrickToken
-- Run this in the Supabase SQL Editor

CREATE TABLE sell_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id uuid REFERENCES investors(id) NOT NULL,
  property_id uuid REFERENCES properties(id) NOT NULL,
  holding_id uuid REFERENCES holdings(id) NOT NULL,
  tokens integer NOT NULL CHECK (tokens > 0),
  price_per_token numeric(12,2) NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'filled', 'partial')),
  tokens_remaining integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE trades (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sell_order_id uuid REFERENCES sell_orders(id) NOT NULL,
  buyer_id uuid REFERENCES investors(id) NOT NULL,
  seller_id uuid REFERENCES investors(id) NOT NULL,
  property_id uuid REFERENCES properties(id) NOT NULL,
  tokens integer NOT NULL,
  price_per_token numeric(12,2) NOT NULL,
  total_amount numeric(12,2) NOT NULL,
  fee numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_sell_orders_status ON sell_orders(status);
CREATE INDEX idx_sell_orders_property ON sell_orders(property_id);
CREATE INDEX idx_sell_orders_seller ON sell_orders(seller_id);
CREATE INDEX idx_trades_buyer ON trades(buyer_id);
CREATE INDEX idx_trades_seller ON trades(seller_id);
CREATE INDEX idx_trades_property ON trades(property_id);

-- Enable RLS
ALTER TABLE sell_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- RLS policies for sell_orders
CREATE POLICY "Anyone can read active sell orders"
  ON sell_orders FOR SELECT
  USING (status IN ('active', 'partial'));

CREATE POLICY "Sellers can read their own orders"
  ON sell_orders FOR SELECT
  USING (seller_id IN (SELECT id FROM investors WHERE email = auth.email()));

CREATE POLICY "Authenticated users can create sell orders"
  ON sell_orders FOR INSERT
  WITH CHECK (seller_id IN (SELECT id FROM investors WHERE email = auth.email()));

CREATE POLICY "Sellers can update their own orders"
  ON sell_orders FOR UPDATE
  USING (seller_id IN (SELECT id FROM investors WHERE email = auth.email()));

-- RLS policies for trades
CREATE POLICY "Users can read their own trades"
  ON trades FOR SELECT
  USING (
    buyer_id IN (SELECT id FROM investors WHERE email = auth.email())
    OR seller_id IN (SELECT id FROM investors WHERE email = auth.email())
  );

CREATE POLICY "Authenticated users can create trades"
  ON trades FOR INSERT
  WITH CHECK (buyer_id IN (SELECT id FROM investors WHERE email = auth.email()));
