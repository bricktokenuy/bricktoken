CREATE TABLE IF NOT EXISTS distributions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid REFERENCES properties(id) NOT NULL,
  period text NOT NULL,
  total_amount numeric(12,2) NOT NULL,
  per_token_amount numeric(12,4) NOT NULL,
  distributed_at timestamptz,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'distributed')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(property_id, period)
);
