-- BrickToken — Asignación de mints devnet a propiedades.
-- Generado por scripts/create-devnet-tokens.ts. Aplicar tras la migración
-- 20260705000000_add_mint_address.sql. Idempotente (UPDATE por slug).

UPDATE properties SET mint_address = 'DPT6jzaDud6UDa2WmHPbVsNKFdUj66CaRkiiXQrGxwni', mint_cluster = 'devnet' WHERE slug = 'apartamento-playa-brava';
UPDATE properties SET mint_address = '8XoMgAiRfLFLoSXWNpQqmrToWdFzBU2UAQoy4mN3TnE1', mint_cluster = 'devnet' WHERE slug = 'casa-carrasco';
UPDATE properties SET mint_address = 'HUeT4xYJNYZeUyVABCuoABvSeFxfpDKRq3K5UeNZGoZj', mint_cluster = 'devnet' WHERE slug = 'local-comercial-ciudad-vieja';
UPDATE properties SET mint_address = '98hhVFKDqAAe4aVZTVJpp1S33gkC21moZHnPD9h3ypdH', mint_cluster = 'devnet' WHERE slug = 'terreno-colonia';
UPDATE properties SET mint_address = '8gjdkq2U2dwUbEucp7f9WbuAsvjGW6EvFZDeYKajn3xV', mint_cluster = 'devnet' WHERE slug = 'penthouse-pocitos';
UPDATE properties SET mint_address = 'CMwMqJjT2CAZqwqW8GQvsGGdMjG9WSybGC9vRCvqPAv8', mint_cluster = 'devnet' WHERE slug = 'chacra-jose-ignacio';
