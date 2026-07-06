/**
 * BRICKTOKEN — Creación de tokens SPL en DEVNET (demostración técnica)
 * ---------------------------------------------------------------------
 * Crea un mint SPL por cada propiedad demo del catálogo:
 *   - decimals = 0  (un token = una fracción indivisible del inmueble)
 *   - supply   = total_tokens de la propiedad
 *   - mint authority + freeze authority = keypair de autoridad (devnet)
 *   - metadata on-chain Metaplex (nombre / símbolo), opcional (best-effort)
 *
 * ⚠️  SOLO DEVNET. Nunca mainnet. El marco regulatorio no está validado.
 *
 * La keypair de autoridad vive FUERA del repo y de iCloud:
 *     ~/.bricktoken-secrets/devnet-authority.json   (chmod 600)
 *
 * Ejecutar:
 *     cd ~/code/bricktoken
 *     npx tsx scripts/create-devnet-tokens.ts
 *
 * Es idempotente: guarda el resultado en scripts/.devnet-mints.json y si
 * una propiedad ya tiene mint creado, no lo vuelve a crear.
 *
 * Fuente de verdad del supply: src/lib/demo-data.ts (las 6 propiedades demo,
 * espejadas en la tabla `properties` de Supabase). Se mapea por `slug`, que
 * es la clave única estable compartida entre la DB y los datos demo.
 */

import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  clusterApiUrl,
} from '@solana/web3.js'
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getMint,
} from '@solana/spl-token'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import {
  keypairIdentity,
  publicKey as umiPublicKey,
  percentAmount,
} from '@metaplex-foundation/umi'
import {
  createV1,
  mplTokenMetadata,
  TokenStandard,
  fetchMetadataFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata'
import { promises as fs } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const CLUSTER = 'devnet' as const
const RPC_URL = process.env.BRICKTOKEN_DEVNET_RPC || clusterApiUrl(CLUSTER)
const SECRETS_DIR = path.join(os.homedir(), '.bricktoken-secrets')
const AUTHORITY_PATH = path.join(SECRETS_DIR, 'devnet-authority.json')
const STATE_PATH = path.join(__dirname, '.devnet-mints.json')

const DECIMALS = 0
const MIN_SOL = 0.5 // mínimo de saldo que queremos antes de crear mints

// Catálogo de propiedades (espejo de src/lib/demo-data.ts, mapeo por slug).
// symbol: BRICK1..BRICK6 (≤10 chars, límite de símbolo Metaplex).
type PropSeed = {
  slug: string
  name: string
  symbol: string
  supply: number
}

const PROPERTIES: PropSeed[] = [
  { slug: 'apartamento-playa-brava', name: 'Apartamento Playa Brava', symbol: 'BRICK1', supply: 4200 },
  { slug: 'casa-carrasco', name: 'Casa en Carrasco', symbol: 'BRICK2', supply: 3400 },
  { slug: 'local-comercial-ciudad-vieja', name: 'Local Comercial Ciudad Vieja', symbol: 'BRICK3', supply: 7000 },
  { slug: 'terreno-colonia', name: 'Terreno Colonia del Sacramento', symbol: 'BRICK4', supply: 3600 },
  { slug: 'penthouse-pocitos', name: 'Penthouse Pocitos', symbol: 'BRICK5', supply: 5200 },
  { slug: 'chacra-jose-ignacio', name: 'Chacra José Ignacio', symbol: 'BRICK6', supply: 2400 },
]

// ---------------------------------------------------------------------------
// Tipos del archivo de estado
// ---------------------------------------------------------------------------
type MintRecord = {
  slug: string
  name: string
  symbol: string
  tokenName: string // "BRICK — <name>"
  supply: number
  decimals: number
  mint: string
  authority: string
  metadataApplied: boolean
  metadataError?: string
  cluster: 'devnet'
  createTxSignature?: string
  mintToTxSignature?: string
  solscan: string
}

type State = Record<string, MintRecord> // key = slug

// ---------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function solscanToken(mint: string): string {
  return `https://solscan.io/token/${mint}?cluster=devnet`
}

async function loadOrCreateAuthority(): Promise<Keypair> {
  await fs.mkdir(SECRETS_DIR, { recursive: true, mode: 0o700 })
  try {
    const raw = await fs.readFile(AUTHORITY_PATH, 'utf8')
    const secret = Uint8Array.from(JSON.parse(raw))
    const kp = Keypair.fromSecretKey(secret)
    console.log(`🔑 Authority existente: ${kp.publicKey.toBase58()}`)
    return kp
  } catch {
    const kp = Keypair.generate()
    await fs.writeFile(AUTHORITY_PATH, JSON.stringify(Array.from(kp.secretKey)), {
      mode: 0o600,
    })
    await fs.chmod(AUTHORITY_PATH, 0o600)
    console.log(`🔑 Authority NUEVA generada: ${kp.publicKey.toBase58()}`)
    console.log(`   guardada en ${AUTHORITY_PATH} (chmod 600)`)
    return kp
  }
}

async function loadState(): Promise<State> {
  try {
    const raw = await fs.readFile(STATE_PATH, 'utf8')
    return JSON.parse(raw) as State
  } catch {
    return {}
  }
}

async function saveState(state: State): Promise<void> {
  await fs.writeFile(STATE_PATH, JSON.stringify(state, null, 2))
}

/** Airdrop con retries — el faucet de devnet es caprichoso. */
async function ensureFunds(conn: Connection, kp: Keypair): Promise<number> {
  let balance = (await conn.getBalance(kp.publicKey)) / LAMPORTS_PER_SOL
  console.log(`💰 Saldo inicial: ${balance} SOL`)
  if (balance >= MIN_SOL) return balance

  const maxAttempts = 6
  for (let i = 1; i <= maxAttempts && balance < MIN_SOL; i++) {
    try {
      console.log(`   Airdrop intento ${i}/${maxAttempts} (1 SOL)…`)
      const sig = await conn.requestAirdrop(kp.publicKey, 1 * LAMPORTS_PER_SOL)
      const bh = await conn.getLatestBlockhash()
      await conn.confirmTransaction(
        { signature: sig, ...bh },
        'confirmed',
      )
      balance = (await conn.getBalance(kp.publicKey)) / LAMPORTS_PER_SOL
      console.log(`   ✓ saldo: ${balance} SOL`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.log(`   ✗ airdrop falló: ${msg}`)
      await sleep(2500 * i) // backoff
    }
  }

  if (balance < MIN_SOL) {
    console.warn(
      `⚠️  No se alcanzó ${MIN_SOL} SOL (saldo ${balance}). ` +
        `El faucet de devnet puede estar rate-limited. ` +
        `Opciones: reintentar más tarde, o financiar la wallet ` +
        `${kp.publicKey.toBase58()} desde https://faucet.solana.com`,
    )
  }
  return balance
}

// ---------------------------------------------------------------------------
// Metadata Metaplex (best-effort). No aborta si falla.
// ---------------------------------------------------------------------------
async function applyMetadata(
  authority: Keypair,
  mint: PublicKey,
  tokenName: string,
  symbol: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const umi = createUmi(RPC_URL).use(mplTokenMetadata())
    const umiKp = umi.eddsa.createKeypairFromSecretKey(authority.secretKey)
    umi.use(keypairIdentity(umiKp))

    const umiMint = umiPublicKey(mint.toBase58())

    // Si ya existe la metadata, no la recreamos.
    try {
      await fetchMetadataFromSeeds(umi, { mint: umiMint })
      return { ok: true } // ya existía
    } catch {
      // no existe -> la creamos abajo
    }

    await createV1(umi, {
      mint: umiMint,
      authority: umi.identity,
      payer: umi.identity,
      updateAuthority: umi.identity,
      name: tokenName,
      symbol,
      uri: '', // sin JSON off-chain en esta fase (ver docs/tokens-devnet.md)
      sellerFeeBasisPoints: percentAmount(0),
      decimals: DECIMALS,
      tokenStandard: TokenStandard.Fungible,
    }).sendAndConfirm(umi, { confirm: { commitment: 'confirmed' } })

    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

// ---------------------------------------------------------------------------
// Artefactos: SQL de UPDATE (por slug) + doc markdown
// ---------------------------------------------------------------------------
async function writeArtifacts(state: State, authorityPk: string): Promise<void> {
  const records = PROPERTIES.map((p) => state[p.slug]).filter(Boolean)

  // SQL — UPDATE por slug (clave estable compartida DB <-> demo-data)
  const sqlLines = [
    '-- BrickToken — Asignación de mints devnet a propiedades.',
    '-- Generado por scripts/create-devnet-tokens.ts. Aplicar tras la migración',
    '-- 20260705000000_add_mint_address.sql. Idempotente (UPDATE por slug).',
    '',
  ]
  for (const r of records) {
    sqlLines.push(
      `UPDATE properties SET mint_address = '${r.mint}', mint_cluster = 'devnet' WHERE slug = '${r.slug}';`,
    )
  }
  sqlLines.push('')
  const sqlPath = path.join(__dirname, 'assign-devnet-mints.sql')
  await fs.writeFile(sqlPath, sqlLines.join('\n'))
  console.log(`\n📝 SQL de asignación escrito en: ${sqlPath}`)

  // Doc markdown
  const docLines = [
    '# Tokens BrickToken en DEVNET',
    '',
    '> ⚠️ **Solo devnet.** Demostración técnica del circuito de tokenización.',
    '> Ningún token tiene valor. El marco regulatorio uruguayo para tokenización',
    '> inmobiliaria NO está validado; no se emite en mainnet hasta el OK legal.',
    '',
    `**Cluster:** devnet  ·  **Generado:** ${new Date().toISOString()}`,
    '',
    '## Autoridad (mint + freeze authority)',
    '',
    `- Pubkey: \`${authorityPk}\``,
    '- Keypair: `~/.bricktoken-secrets/devnet-authority.json` (chmod 600, fuera del repo y de iCloud)',
    '',
    '## Mints',
    '',
    '| Propiedad | Símbolo | Supply | Decimals | Mint | Metadata | Solscan |',
    '|-----------|---------|-------:|---------:|------|----------|---------|',
  ]
  for (const r of records) {
    docLines.push(
      `| ${r.name} | ${r.symbol} | ${r.supply} | ${r.decimals} | \`${r.mint}\` | ${
        r.metadataApplied ? '✓' : '✗'
      } | [ver](${r.solscan}) |`,
    )
  }
  docLines.push(
    '',
    '## Notas',
    '',
    '- `decimals = 0`: cada token es una fracción indivisible de la propiedad.',
    '- El supply total se minteó a la ATA de la autoridad. La distribución a',
    '  inversores es un paso posterior (fuera de este script).',
    '- La metadata on-chain (nombre/símbolo) usa Metaplex Token Metadata sin JSON',
    '  off-chain (`uri` vacío) en esta fase. Si alguna fila muestra metadata ✗, el',
    '  mint es igualmente válido y operable; la metadata puede reintentarse.',
    '- Mapeo mint↔propiedad por `slug` (clave única estable en DB y en demo-data).',
    '',
  )
  const docPath = path.join(__dirname, '..', 'docs', 'tokens-devnet.md')
  await fs.writeFile(docPath, docLines.join('\n'))
  console.log(`📄 Doc escrita en: ${docPath}`)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('════════════════════════════════════════════════════════')
  console.log('  BRICKTOKEN — mints SPL en DEVNET (demo técnica)')
  console.log(`  RPC: ${RPC_URL}`)
  console.log('════════════════════════════════════════════════════════\n')

  const authority = await loadOrCreateAuthority()
  const conn = new Connection(RPC_URL, 'confirmed')

  const startBalance = await ensureFunds(conn, authority)
  if (startBalance <= 0) {
    console.error('❌ Sin SOL para operar. Abortando.')
    process.exit(1)
  }

  const state = await loadState()

  for (const p of PROPERTIES) {
    const tokenName = `BRICK — ${p.name}`
    console.log(`\n──── ${p.slug} (${p.symbol}) ────`)

    let rec = state[p.slug]

    // 1) Crear mint (idempotente)
    if (rec?.mint) {
      console.log(`  ↺ mint ya existe: ${rec.mint} (se reutiliza)`)
    } else {
      console.log(`  • Creando mint (decimals=${DECIMALS})…`)
      const mint = await createMint(
        conn,
        authority, // payer
        authority.publicKey, // mint authority
        authority.publicKey, // freeze authority
        DECIMALS,
      )
      rec = {
        slug: p.slug,
        name: p.name,
        symbol: p.symbol,
        tokenName,
        supply: p.supply,
        decimals: DECIMALS,
        mint: mint.toBase58(),
        authority: authority.publicKey.toBase58(),
        metadataApplied: false,
        cluster: 'devnet',
        solscan: solscanToken(mint.toBase58()),
      }
      state[p.slug] = rec
      await saveState(state)
      console.log(`    ✓ mint: ${rec.mint}`)
    }

    const mintPk = new PublicKey(rec.mint)

    // 2) Mintear el supply total a la ATA de la autoridad (si falta)
    const current = await getMint(conn, mintPk)
    const currentSupply = Number(current.supply)
    if (currentSupply >= p.supply) {
      console.log(`  ↺ supply ya minteado: ${currentSupply}`)
    } else {
      const toMint = p.supply - currentSupply
      console.log(`  • Minteando ${toMint} tokens a la ATA de la autoridad…`)
      const ata = await getOrCreateAssociatedTokenAccount(
        conn,
        authority,
        mintPk,
        authority.publicKey,
      )
      const sig = await mintTo(
        conn,
        authority,
        mintPk,
        ata.address,
        authority, // mint authority
        toMint, // decimals=0 => unidades enteras
      )
      rec.mintToTxSignature = sig
      await saveState(state)
      console.log(`    ✓ supply=${p.supply} · tx ${sig}`)
    }

    // 3) Metadata on-chain (best-effort)
    if (rec.metadataApplied) {
      console.log('  ↺ metadata ya aplicada')
    } else {
      console.log(`  • Aplicando metadata Metaplex ("${tokenName}" / ${p.symbol})…`)
      const res = await applyMetadata(authority, mintPk, tokenName, p.symbol)
      rec.metadataApplied = res.ok
      rec.metadataError = res.ok ? undefined : res.error
      await saveState(state)
      if (res.ok) {
        console.log('    ✓ metadata on-chain OK')
      } else {
        console.log(`    ⚠️  metadata falló (mint queda válido igual): ${res.error}`)
      }
    }
  }

  // 4) Generar artefactos: SQL de UPDATE por slug + doc markdown.
  await writeArtifacts(state, authority.publicKey.toBase58())

  const endBalance = (await conn.getBalance(authority.publicKey)) / LAMPORTS_PER_SOL
  const spent = startBalance - endBalance

  console.log('\n════════════════════════════════════════════════════════')
  console.log('  RESUMEN')
  console.log('════════════════════════════════════════════════════════')
  for (const p of PROPERTIES) {
    const r = state[p.slug]
    const meta = r.metadataApplied ? 'metadata✓' : 'metadata✗'
    console.log(`  ${p.symbol}  ${p.slug}`)
    console.log(`     mint: ${r.mint}`)
    console.log(`     supply: ${r.supply}  ·  ${meta}`)
    console.log(`     ${r.solscan}`)
  }
  console.log(`\n  Authority: ${authority.publicKey.toBase58()}`)
  console.log(`  Saldo final: ${endBalance.toFixed(6)} SOL  ·  gastado ≈ ${spent.toFixed(6)} SOL`)
  console.log(`  Estado guardado en: ${STATE_PATH}`)
  console.log('════════════════════════════════════════════════════════')
}

main().catch((e) => {
  console.error('\n❌ Error fatal:', e)
  process.exit(1)
})
