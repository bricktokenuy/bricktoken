export function HeroSkyline() {
  return (
    <svg
      className="absolute bottom-0 left-0 w-full opacity-[0.07] sm:opacity-[0.09]"
      viewBox="0 0 1440 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMax slice"
    >
      {/* ——— FAR LEFT: Short warehouse ——— */}
      <rect x="20" y="320" width="80" height="100" stroke="white" strokeWidth="0.8" />
      <line x1="20" y1="340" x2="100" y2="340" stroke="white" strokeWidth="0.5" />
      {[35, 55, 75].map(x => (
        <rect key={`w1-${x}`} x={x} y="350" width="12" height="16" stroke="white" strokeWidth="0.5" />
      ))}
      {[35, 55, 75].map(x => (
        <rect key={`w1b-${x}`} x={x} y="380" width="12" height="16" stroke="white" strokeWidth="0.5" />
      ))}

      {/* ——— Tower 1: Slim tall ——— */}
      <rect x="110" y="140" width="50" height="280" stroke="white" strokeWidth="0.8" />
      <rect x="120" y="120" width="30" height="20" stroke="white" strokeWidth="0.8" />
      <line x1="135" y1="95" x2="135" y2="120" stroke="white" strokeWidth="0.8" />
      <line x1="128" y1="105" x2="142" y2="105" stroke="white" strokeWidth="0.5" />
      {/* Windows */}
      {[160, 190, 220, 250, 280, 310, 340, 370].map(y => (
        <g key={`t1-${y}`}>
          <rect x="118" y={y} width="10" height="14" stroke="white" strokeWidth="0.4" />
          <rect x="133" y={y} width="10" height="14" stroke="white" strokeWidth="0.4" />
          <rect x="148" y={y} width="10" height="14" stroke="white" strokeWidth="0.4" />
        </g>
      ))}
      {/* Floor lines */}
      {[185, 215, 245, 275, 305, 335, 365, 395].map(y => (
        <line key={`fl1-${y}`} x1="110" y1={y} x2="160" y2={y} stroke="white" strokeWidth="0.2" />
      ))}

      {/* ——— Building 2: Wide mid-height ——— */}
      <rect x="170" y="230" width="90" height="190" stroke="white" strokeWidth="0.8" />
      <rect x="175" y="220" width="80" height="10" stroke="white" strokeWidth="0.5" />
      {/* Window grid */}
      {[250, 280, 310, 340, 370, 395].map(y => (
        <g key={`b2-${y}`}>
          {[180, 198, 216, 234].map(x => (
            <rect key={`b2-${x}-${y}`} x={x} y={y} width="12" height="16" stroke="white" strokeWidth="0.4" />
          ))}
        </g>
      ))}
      {/* Rooftop detail */}
      <rect x="200" y="210" width="20" height="10" stroke="white" strokeWidth="0.5" />
      <rect x="230" y="205" width="15" height="15" stroke="white" strokeWidth="0.5" />

      {/* ——— Tower 2: Main tall tower (left cluster) ——— */}
      <rect x="270" y="80" width="65" height="340" stroke="white" strokeWidth="1" />
      {/* Crown */}
      <rect x="280" y="60" width="45" height="20" stroke="white" strokeWidth="0.8" />
      <rect x="295" y="40" width="15" height="20" stroke="white" strokeWidth="0.8" />
      <line x1="302" y1="15" x2="302" y2="40" stroke="white" strokeWidth="0.8" />
      <line x1="295" y1="25" x2="310" y2="25" stroke="white" strokeWidth="0.5" />
      {/* Vertical accent lines */}
      <line x1="290" y1="80" x2="290" y2="420" stroke="white" strokeWidth="0.3" />
      <line x1="315" y1="80" x2="315" y2="420" stroke="white" strokeWidth="0.3" />
      {/* Window grid */}
      {[100, 130, 160, 190, 220, 250, 280, 310, 340, 370, 395].map(y => (
        <g key={`t2-${y}`}>
          <rect x="278" y={y} width="10" height="15" stroke="white" strokeWidth="0.4" />
          <rect x="295" y={y} width="14" height="15" stroke="white" strokeWidth="0.4" />
          <rect x="318" y={y} width="10" height="15" stroke="white" strokeWidth="0.4" />
        </g>
      ))}

      {/* ——— Building 3: Stepped/setback ——— */}
      <rect x="345" y="260" width="70" height="160" stroke="white" strokeWidth="0.8" />
      <rect x="350" y="200" width="55" height="60" stroke="white" strokeWidth="0.8" />
      <rect x="358" y="175" width="35" height="25" stroke="white" strokeWidth="0.8" />
      {/* Windows */}
      {[285, 315, 345, 375].map(y => (
        <g key={`b3-${y}`}>
          {[355, 373, 391].map(x => (
            <rect key={`b3-${x}-${y}`} x={x} y={y} width="11" height="16" stroke="white" strokeWidth="0.4" />
          ))}
        </g>
      ))}
      {[215, 240].map(y => (
        <g key={`b3u-${y}`}>
          {[360, 378, 396].map(x => (
            <rect key={`b3u-${x}-${y}`} x={x-5} y={y} width="10" height="13" stroke="white" strokeWidth="0.4" />
          ))}
        </g>
      ))}

      {/* ——— Gap / park area ——— */}

      {/* ——— Building 4: Modern glass tower (center-left) ——— */}
      <rect x="440" y="150" width="55" height="270" stroke="white" strokeWidth="0.8" />
      {/* Horizontal bands (modern glass look) */}
      {[165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 405].map(y => (
        <line key={`gl-${y}`} x1="440" y1={y} x2="495" y2={y} stroke="white" strokeWidth="0.25" />
      ))}
      {/* Vertical mullions */}
      <line x1="455" y1="150" x2="455" y2="420" stroke="white" strokeWidth="0.3" />
      <line x1="468" y1="150" x2="468" y2="420" stroke="white" strokeWidth="0.3" />
      <line x1="481" y1="150" x2="481" y2="420" stroke="white" strokeWidth="0.3" />
      {/* Rooftop */}
      <rect x="452" y="135" width="28" height="15" stroke="white" strokeWidth="0.5" />
      <line x1="466" y1="115" x2="466" y2="135" stroke="white" strokeWidth="0.6" />

      {/* ——— Building 5: Short wide ——— */}
      <rect x="505" y="310" width="75" height="110" stroke="white" strokeWidth="0.8" />
      <line x1="505" y1="330" x2="580" y2="330" stroke="white" strokeWidth="0.4" />
      {[520, 540, 560].map(x => (
        <g key={`b5-${x}`}>
          <rect x={x} y="340" width="14" height="18" stroke="white" strokeWidth="0.4" />
          <rect x={x} y="370" width="14" height="18" stroke="white" strokeWidth="0.4" />
          <rect x={x} y="395" width="14" height="18" stroke="white" strokeWidth="0.4" />
        </g>
      ))}

      {/* ——— CENTRAL GAP — content zone, less detail ——— */}

      {/* ——— Building 6: Low-rise right of center ——— */}
      <rect x="620" y="340" width="60" height="80" stroke="white" strokeWidth="0.7" />
      {[630, 650, 668].map(x => (
        <rect key={`b6-${x}`} x={x} y="355" width="10" height="14" stroke="white" strokeWidth="0.4" />
      ))}
      {[630, 650, 668].map(x => (
        <rect key={`b6b-${x}`} x={x} y="385" width="10" height="14" stroke="white" strokeWidth="0.4" />
      ))}

      {/* ——— RIGHT CLUSTER ——— */}

      {/* ——— Tower 3: Tallest building (right) ——— */}
      <rect x="820" y="50" width="70" height="370" stroke="white" strokeWidth="1" />
      {/* Spire */}
      <line x1="855" y1="0" x2="855" y2="50" stroke="white" strokeWidth="0.8" />
      <rect x="840" y="30" width="30" height="20" stroke="white" strokeWidth="0.6" />
      <line x1="845" y1="40" x2="865" y2="40" stroke="white" strokeWidth="0.4" />
      {/* Facade detail — vertical columns */}
      <line x1="838" y1="50" x2="838" y2="420" stroke="white" strokeWidth="0.3" />
      <line x1="855" y1="50" x2="855" y2="420" stroke="white" strokeWidth="0.3" />
      <line x1="872" y1="50" x2="872" y2="420" stroke="white" strokeWidth="0.3" />
      {/* Window rows */}
      {[70, 100, 130, 160, 190, 220, 250, 280, 310, 340, 370, 395].map(y => (
        <g key={`t3-${y}`}>
          <rect x="826" y={y} width="10" height="14" stroke="white" strokeWidth="0.35" />
          <rect x="843" y={y} width="10" height="14" stroke="white" strokeWidth="0.35" />
          <rect x="860" y={y} width="10" height="14" stroke="white" strokeWidth="0.35" />
          <rect x="877" y={y} width="10" height="14" stroke="white" strokeWidth="0.35" />
        </g>
      ))}

      {/* ——— Building 7: Modern curved-top ——— */}
      <rect x="900" y="180" width="60" height="240" stroke="white" strokeWidth="0.8" />
      <path d="M900 180 Q930 160 960 180" stroke="white" strokeWidth="0.8" fill="none" />
      {/* Horizontal bands */}
      {[200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400].map(y => (
        <line key={`b7-${y}`} x1="900" y1={y} x2="960" y2={y} stroke="white" strokeWidth="0.25" />
      ))}
      <line x1="920" y1="180" x2="920" y2="420" stroke="white" strokeWidth="0.3" />
      <line x1="940" y1="180" x2="940" y2="420" stroke="white" strokeWidth="0.3" />

      {/* ——— Building 8: Twin towers ——— */}
      <rect x="975" y="200" width="30" height="220" stroke="white" strokeWidth="0.8" />
      <rect x="1010" y="220" width="30" height="200" stroke="white" strokeWidth="0.8" />
      {/* Bridge between */}
      <rect x="1005" y="300" width="5" height="20" stroke="white" strokeWidth="0.4" />
      {/* Windows left twin */}
      {[225, 260, 295, 330, 365, 395].map(y => (
        <g key={`tw1-${y}`}>
          <rect x="981" y={y} width="8" height="12" stroke="white" strokeWidth="0.35" />
          <rect x="993" y={y} width="8" height="12" stroke="white" strokeWidth="0.35" />
        </g>
      ))}
      {/* Windows right twin */}
      {[245, 280, 315, 350, 385].map(y => (
        <g key={`tw2-${y}`}>
          <rect x="1016" y={y} width="8" height="12" stroke="white" strokeWidth="0.35" />
          <rect x="1028" y={y} width="8" height="12" stroke="white" strokeWidth="0.35" />
        </g>
      ))}
      {/* Antennas */}
      <line x1="990" y1="185" x2="990" y2="200" stroke="white" strokeWidth="0.5" />
      <line x1="1025" y1="208" x2="1025" y2="220" stroke="white" strokeWidth="0.5" />

      {/* ——— Building 9: Wide commercial ——— */}
      <rect x="1055" y="280" width="90" height="140" stroke="white" strokeWidth="0.8" />
      <line x1="1055" y1="300" x2="1145" y2="300" stroke="white" strokeWidth="0.4" />
      {/* Rooftop structures */}
      <rect x="1075" y="265" width="25" height="15" stroke="white" strokeWidth="0.5" />
      <rect x="1115" y="270" width="15" height="10" stroke="white" strokeWidth="0.5" />
      {/* Windows */}
      {[310, 340, 370, 395].map(y => (
        <g key={`b9-${y}`}>
          {[1065, 1083, 1101, 1119].map(x => (
            <rect key={`b9-${x}-${y}`} x={x} y={y} width="12" height="16" stroke="white" strokeWidth="0.35" />
          ))}
        </g>
      ))}

      {/* ——— Tower 4: Slim elegant (far right) ——— */}
      <rect x="1160" y="130" width="45" height="290" stroke="white" strokeWidth="0.8" />
      <rect x="1167" y="115" width="30" height="15" stroke="white" strokeWidth="0.6" />
      <line x1="1182" y1="90" x2="1182" y2="115" stroke="white" strokeWidth="0.6" />
      {/* Vertical accents */}
      <line x1="1175" y1="130" x2="1175" y2="420" stroke="white" strokeWidth="0.25" />
      <line x1="1190" y1="130" x2="1190" y2="420" stroke="white" strokeWidth="0.25" />
      {/* Windows */}
      {[150, 180, 210, 240, 270, 300, 330, 360, 390].map(y => (
        <g key={`t4-${y}`}>
          <rect x="1166" y={y} width="9" height="14" stroke="white" strokeWidth="0.35" />
          <rect x="1180" y={y} width="9" height="14" stroke="white" strokeWidth="0.35" />
          <rect x="1194" y={y} width="9" height="14" stroke="white" strokeWidth="0.35" />
        </g>
      ))}

      {/* ——— Building 10: Short end cap ——— */}
      <rect x="1215" y="330" width="55" height="90" stroke="white" strokeWidth="0.7" />
      {[1225, 1245].map(x => (
        <g key={`b10-${x}`}>
          <rect x={x} y="345" width="12" height="16" stroke="white" strokeWidth="0.4" />
          <rect x={x} y="375" width="12" height="16" stroke="white" strokeWidth="0.4" />
        </g>
      ))}

      {/* ——— Small far-right detail ——— */}
      <rect x="1280" y="360" width="50" height="60" stroke="white" strokeWidth="0.6" />
      <rect x="1290" y="375" width="10" height="14" stroke="white" strokeWidth="0.35" />
      <rect x="1310" y="375" width="10" height="14" stroke="white" strokeWidth="0.35" />
      <rect x="1290" y="395" width="10" height="14" stroke="white" strokeWidth="0.35" />
      <rect x="1310" y="395" width="10" height="14" stroke="white" strokeWidth="0.35" />

      {/* ——— Distant buildings (very faint, background depth) ——— */}
      <rect x="700" y="290" width="50" height="130" stroke="white" strokeWidth="0.4" opacity="0.5" />
      <rect x="760" y="310" width="40" height="110" stroke="white" strokeWidth="0.4" opacity="0.5" />
      <rect x="420" y="350" width="45" height="70" stroke="white" strokeWidth="0.4" opacity="0.5" />

      {/* ——— Ground line ——— */}
      <line x1="0" y1="420" x2="1440" y2="420" stroke="white" strokeWidth="1.5" />

      {/* ——— Subtle grid lines on ground (perspective depth) ——— */}
      <line x1="0" y1="420" x2="720" y2="390" stroke="white" strokeWidth="0.15" opacity="0.3" />
      <line x1="1440" y1="420" x2="720" y2="390" stroke="white" strokeWidth="0.15" opacity="0.3" />
    </svg>
  )
}
