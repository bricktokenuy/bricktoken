-- Notification preferences for investors
-- Stores per-investor email notification settings.

CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  investor_id uuid REFERENCES investors(id) UNIQUE NOT NULL,
  purchase_confirmed boolean DEFAULT true,
  yield_distributed boolean DEFAULT true,
  platform_news boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_notification_preferences_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notification_preferences_updated
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_preferences_timestamp();

-- RLS policies
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Investors can read and update their own preferences
CREATE POLICY "Investors can view own preferences"
  ON notification_preferences
  FOR SELECT
  USING (investor_id = auth.uid());

CREATE POLICY "Investors can update own preferences"
  ON notification_preferences
  FOR UPDATE
  USING (investor_id = auth.uid());

CREATE POLICY "Investors can insert own preferences"
  ON notification_preferences
  FOR INSERT
  WITH CHECK (investor_id = auth.uid());
