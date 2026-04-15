CREATE TABLE valuations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid REFERENCES properties(id) NOT NULL,
  previous_value numeric(12,2) NOT NULL,
  new_value numeric(12,2) NOT NULL,
  previous_token_price numeric(12,2) NOT NULL,
  new_token_price numeric(12,2) NOT NULL,
  change_pct numeric(5,2) NOT NULL,
  appraiser text, -- Name of the appraiser/company
  notes text,
  valuation_date date NOT NULL,
  applied_at timestamptz,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'applied')),
  created_at timestamptz DEFAULT now()
);

-- Index for efficient queries by property
CREATE INDEX idx_valuations_property_id ON valuations(property_id);

-- Index for filtering by status
CREATE INDEX idx_valuations_status ON valuations(status);
