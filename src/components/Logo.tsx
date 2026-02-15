interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 40, showText = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          {/* Main gradient */}
          <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>

          {/* Shine gradient */}
          <linearGradient id="logoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Dark background gradient */}
          <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1f35" />
            <stop offset="100%" stopColor="#0f1429" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Inner shadow */}
          <filter id="innerShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
          </filter>

          {/* Outer glow */}
          <filter id="outerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="hexClip">
            <polygon points="60,5 110,30 110,90 60,115 10,90 10,30" />
          </clipPath>
        </defs>

        {/* Outer glow ring */}
        <polygon
          points="60,5 110,30 110,90 60,115 10,90 10,30"
          fill="none"
          stroke="url(#logoGrad1)"
          strokeWidth="1.5"
          opacity="0.3"
          filter="url(#outerGlow)"
        />

        {/* Hexagon background */}
        <polygon
          points="60,8 107,32 107,88 60,112 13,88 13,32"
          fill="url(#logoBg)"
          stroke="url(#logoGrad1)"
          strokeWidth="2.5"
          filter="url(#innerShadow)"
        />

        {/* Inner hexagon border accent */}
        <polygon
          points="60,18 97,38 97,82 60,102 23,82 23,38"
          fill="none"
          stroke="url(#logoGrad1)"
          strokeWidth="0.8"
          opacity="0.25"
        />

        {/* Circuit lines - left */}
        <line x1="23" y1="50" x2="35" y2="50" stroke="#F59E0B" strokeWidth="0.8" opacity="0.2" />
        <line x1="23" y1="70" x2="35" y2="70" stroke="#F59E0B" strokeWidth="0.8" opacity="0.2" />
        <circle cx="35" cy="50" r="1.5" fill="#F59E0B" opacity="0.3" />
        <circle cx="35" cy="70" r="1.5" fill="#F59E0B" opacity="0.3" />

        {/* Circuit lines - right */}
        <line x1="85" y1="50" x2="97" y2="50" stroke="#F59E0B" strokeWidth="0.8" opacity="0.2" />
        <line x1="85" y1="70" x2="97" y2="70" stroke="#F59E0B" strokeWidth="0.8" opacity="0.2" />
        <circle cx="85" cy="50" r="1.5" fill="#F59E0B" opacity="0.3" />
        <circle cx="85" cy="70" r="1.5" fill="#F59E0B" opacity="0.3" />

        {/* The Z lightning bolt - main symbol */}
        <g filter="url(#logoGlow)">
          <path
            d="M 44 35 L 76 35 L 52 58 L 72 58 L 42 90 L 52 62 L 38 62 Z"
            fill="url(#logoGrad1)"
            stroke="url(#logoGrad2)"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </g>

        {/* Highlight shine on the Z */}
        <path
          d="M 46 37 L 73 37 L 54 55 L 58 55"
          fill="none"
          stroke="#FDE68A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />

        {/* Small decorative dots */}
        <circle cx="60" cy="20" r="2" fill="#F59E0B" opacity="0.6" />
        <circle cx="60" cy="100" r="2" fill="#F59E0B" opacity="0.6" />

        {/* Corner accents */}
        <circle cx="35" cy="28" r="1" fill="#F59E0B" opacity="0.15" />
        <circle cx="85" cy="28" r="1" fill="#F59E0B" opacity="0.15" />
        <circle cx="35" cy="92" r="1" fill="#F59E0B" opacity="0.15" />
        <circle cx="85" cy="92" r="1" fill="#F59E0B" opacity="0.15" />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-0.5">
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent"
              style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
              CRYPTO
            </span>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"
              style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
              ZY
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-amber-500/40 font-semibold -mt-0.5">
            Earn Free Crypto
          </span>
        </div>
      )}
    </div>
  );
}

export function LogoIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id="logoIconBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1f35" />
          <stop offset="100%" stopColor="#0f1429" />
        </linearGradient>
      </defs>
      <polygon
        points="60,8 107,32 107,88 60,112 13,88 13,32"
        fill="url(#logoIconBg)"
        stroke="url(#logoIconGrad)"
        strokeWidth="3"
      />
      <path
        d="M 44 35 L 76 35 L 52 58 L 72 58 L 42 90 L 52 62 L 38 62 Z"
        fill="url(#logoIconGrad)"
      />
    </svg>
  );
}
