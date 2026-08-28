export const HeroIllustration = () => (
  <div className="hero-visual" aria-label="Illustration of plumbing tools">
    <div className="sun" />
    <svg
      aria-label="Copper pipe and wrench illustration"
      className="pipe-art"
      role="img"
      viewBox="0 0 600 590"
    >
      <defs>
        <linearGradient id="copper" x1="0" x2="1">
          <stop offset="0" stopColor="#f8a77c" />
          <stop offset=".5" stopColor="#d86237" />
          <stop offset="1" stopColor="#a9381d" />
        </linearGradient>
        <filter id="shadow" height="160%" width="160%" x="-30%" y="-30%">
          <feDropShadow
            dx="0"
            dy="18"
            floodColor="#163334"
            floodOpacity=".18"
            stdDeviation="15"
          />
        </filter>
      </defs>
      <path
        d="M40 475h140c38 0 68-30 68-68V165c0-30 24-54 54-54h95"
        fill="none"
        stroke="#173f3f"
        strokeLinecap="round"
        strokeWidth="56"
      />
      <path
        d="M40 475h140c38 0 68-30 68-68V165c0-30 24-54 54-54h95"
        fill="none"
        stroke="url(#copper)"
        strokeLinecap="round"
        strokeWidth="38"
      />
      <path
        d="M119 438v74M161 438v74M210 332h77M210 374h77M358 72v78M400 72v78"
        stroke="#0f3031"
        strokeWidth="10"
      />
      <g filter="url(#shadow)" transform="rotate(-22 420 325)">
        <path
          d="M445 205a72 72 0 0 0-90 88l43-36 38 16 8 40-43 36a72 72 0 0 0 86-92l93 181c12 24 3 53-21 65s-53 3-65-21l-91-179"
          fill="#f5efe3"
          stroke="#173f3f"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="16"
        />
        <circle
          cx="539"
          cy="459"
          fill="#f2c36b"
          r="13"
          stroke="#173f3f"
          strokeWidth="9"
        />
      </g>
    </svg>
    <div className="experience-stamp">
      <strong>12</strong>
      <span>
        years keeping
        <br />
        things flowing
      </span>
    </div>
    <span className="scribble">proper local service</span>
  </div>
);
