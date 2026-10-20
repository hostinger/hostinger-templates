interface DogIllustrationProps {
  label: string;
}

export function DogIllustration({ label }: DogIllustrationProps) {
  return (
    <svg className="dog-illustration" viewBox="0 0 400 300" role="img" aria-label={label}>
      <circle cx="318" cy="70" r="38" fill="var(--color-sun)" />
      <path d="M0 210 Q90 160 200 190 T400 175 V300 H0 Z" fill="var(--color-hill-back)" />
      <path d="M0 240 Q120 200 230 228 T400 222 V300 H0 Z" fill="var(--color-hill-front)" />
      <path
        d="M20 286 C110 262 160 268 230 252 S350 236 392 240"
        fill="none"
        stroke="var(--color-cream)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="2 16"
      />
      <ellipse cx="190" cy="250" rx="96" ry="9" fill="var(--color-ink)" opacity="0.14" />
      <path d="M120 160 Q86 132 98 98" fill="none" stroke="var(--color-dog)" strokeWidth="14" strokeLinecap="round" />
      <g fill="var(--color-dog)">
        <rect x="128" y="190" width="18" height="56" rx="9" />
        <rect x="156" y="194" width="18" height="52" rx="9" />
        <rect x="214" y="194" width="18" height="52" rx="9" />
        <rect x="240" y="190" width="18" height="56" rx="9" />
        <ellipse cx="192" cy="174" rx="80" ry="40" />
        <path d="M232 150 L262 116 L286 150 L258 196 Z" />
        <circle cx="276" cy="124" r="34" />
        <ellipse cx="306" cy="136" rx="22" ry="15" />
      </g>
      <g fill="var(--color-dog-dark)">
        <ellipse cx="262" cy="122" rx="12" ry="24" transform="rotate(18 262 122)" />
        <rect x="128" y="236" width="20" height="10" rx="5" />
        <rect x="156" y="236" width="20" height="10" rx="5" />
        <rect x="214" y="236" width="20" height="10" rx="5" />
        <rect x="240" y="236" width="20" height="10" rx="5" />
      </g>
      <circle cx="324" cy="130" r="6" fill="var(--color-ink)" />
      <circle cx="286" cy="114" r="4" fill="var(--color-ink)" />
      <path d="M300 148 Q310 154 318 148" fill="none" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
      <path d="M248 140 Q262 168 284 158" fill="none" stroke="var(--color-collar)" strokeWidth="9" strokeLinecap="round" />
      <circle cx="268" cy="162" r="5" fill="var(--color-sun)" />
      <path d="M268 160 C300 110 330 60 396 18" fill="none" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
