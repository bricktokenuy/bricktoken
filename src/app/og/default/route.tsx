import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const revalidate = 86400 // 1 día

export const alt = 'BrickToken — Inversión inmobiliaria tokenizada en Uruguay'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const NAVY = '#0F1729'
const GOLD = '#D4A843'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: NAVY,
          backgroundImage: `radial-gradient(circle at 80% 20%, rgba(212,168,67,0.18), transparent 55%)`,
          padding: '80px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              backgroundColor: GOLD,
              color: NAVY,
              fontWeight: 800,
              fontSize: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              letterSpacing: -1,
            }}
          >
            BT
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'baseline',
            }}
          >
            <span>Brick</span>
            <span style={{ color: GOLD }}>Token</span>
          </div>
        </div>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div
            style={{
              fontSize: 14,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: GOLD,
              fontWeight: 600,
            }}
          >
            Inversión inmobiliaria tokenizada
          </div>
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            Tokenizamos <span style={{ color: GOLD }}>inmuebles</span>.
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#cbd5e1',
              maxWidth: 980,
              lineHeight: 1.35,
            }}
          >
            Invertí desde USD 50 en propiedades uruguayas respaldadas por fideicomisos bajo Ley 17.703.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    }
  )
}
