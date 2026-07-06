# Tokens BrickToken en DEVNET

> ⚠️ **Solo devnet.** Demostración técnica del circuito de tokenización.
> Ningún token tiene valor. El marco regulatorio uruguayo para tokenización
> inmobiliaria NO está validado; no se emite en mainnet hasta el OK legal.

**Cluster:** devnet  ·  **Generado:** 2026-07-05T22:38:55.604Z

## Autoridad (mint + freeze authority)

- Pubkey: `EXKAgQA79BwCZkPUmp9pwkh4oARgBba9J34BaYoyhhsU`
- Keypair: `~/.bricktoken-secrets/devnet-authority.json` (chmod 600, fuera del repo y de iCloud)

## Mints

| Propiedad | Símbolo | Supply | Decimals | Mint | Metadata | Solscan |
|-----------|---------|-------:|---------:|------|----------|---------|
| Apartamento Playa Brava | BRICK1 | 4200 | 0 | `DPT6jzaDud6UDa2WmHPbVsNKFdUj66CaRkiiXQrGxwni` | ✗ | [ver](https://solscan.io/token/DPT6jzaDud6UDa2WmHPbVsNKFdUj66CaRkiiXQrGxwni?cluster=devnet) |
| Casa en Carrasco | BRICK2 | 3400 | 0 | `8XoMgAiRfLFLoSXWNpQqmrToWdFzBU2UAQoy4mN3TnE1` | ✗ | [ver](https://solscan.io/token/8XoMgAiRfLFLoSXWNpQqmrToWdFzBU2UAQoy4mN3TnE1?cluster=devnet) |
| Local Comercial Ciudad Vieja | BRICK3 | 7000 | 0 | `HUeT4xYJNYZeUyVABCuoABvSeFxfpDKRq3K5UeNZGoZj` | ✗ | [ver](https://solscan.io/token/HUeT4xYJNYZeUyVABCuoABvSeFxfpDKRq3K5UeNZGoZj?cluster=devnet) |
| Terreno Colonia del Sacramento | BRICK4 | 3600 | 0 | `98hhVFKDqAAe4aVZTVJpp1S33gkC21moZHnPD9h3ypdH` | ✗ | [ver](https://solscan.io/token/98hhVFKDqAAe4aVZTVJpp1S33gkC21moZHnPD9h3ypdH?cluster=devnet) |
| Penthouse Pocitos | BRICK5 | 5200 | 0 | `8gjdkq2U2dwUbEucp7f9WbuAsvjGW6EvFZDeYKajn3xV` | ✗ | [ver](https://solscan.io/token/8gjdkq2U2dwUbEucp7f9WbuAsvjGW6EvFZDeYKajn3xV?cluster=devnet) |
| Chacra José Ignacio | BRICK6 | 2400 | 0 | `CMwMqJjT2CAZqwqW8GQvsGGdMjG9WSybGC9vRCvqPAv8` | ✗ | [ver](https://solscan.io/token/CMwMqJjT2CAZqwqW8GQvsGGdMjG9WSybGC9vRCvqPAv8?cluster=devnet) |

## Notas

- `decimals = 0`: cada token es una fracción indivisible de la propiedad.
- El supply total se minteó a la ATA de la autoridad. La distribución a
  inversores es un paso posterior (fuera de este script).
- La metadata on-chain (nombre/símbolo) usa Metaplex Token Metadata sin JSON
  off-chain (`uri` vacío) en esta fase. Si alguna fila muestra metadata ✗, el
  mint es igualmente válido y operable; la metadata puede reintentarse.
- Mapeo mint↔propiedad por `slug` (clave única estable en DB y en demo-data).
