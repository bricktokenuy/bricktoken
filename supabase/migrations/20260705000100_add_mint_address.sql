-- BrickToken — Tokenización on-chain (DEVNET)
-- Agrega el mint address SPL de cada propiedad y el cluster donde vive.
--
-- Contexto: demostración técnica del circuito de tokenización. Los mints se
-- crean en DEVNET con scripts/create-devnet-tokens.ts. NUNCA mainnet hasta
-- validar el marco regulatorio uruguayo (ver ficha del proyecto).
--
-- mint_address: dirección base58 del mint SPL (una por propiedad). NULL hasta
--               que se crea el token.
-- mint_cluster: cluster Solana donde vive el mint. Default 'devnet'.

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS mint_address TEXT,
  ADD COLUMN IF NOT EXISTS mint_cluster TEXT NOT NULL DEFAULT 'devnet';

-- Un mint no puede pertenecer a dos propiedades.
CREATE UNIQUE INDEX IF NOT EXISTS uq_properties_mint_address
  ON properties (mint_address)
  WHERE mint_address IS NOT NULL;

-- Solo permitimos clusters conocidos (defensa: nunca escribir mainnet por error
-- en esta fase de demo). Se puede relajar cuando el marco regulatorio habilite prod.
ALTER TABLE properties
  DROP CONSTRAINT IF EXISTS chk_properties_mint_cluster;
ALTER TABLE properties
  ADD CONSTRAINT chk_properties_mint_cluster
  CHECK (mint_cluster IN ('devnet', 'testnet', 'mainnet-beta'));

COMMENT ON COLUMN properties.mint_address IS
  'Dirección del mint SPL (base58) que tokeniza esta propiedad. NULL si aún no tokenizada.';
COMMENT ON COLUMN properties.mint_cluster IS
  'Cluster Solana donde vive el mint (devnet en fase de demo técnica).';
