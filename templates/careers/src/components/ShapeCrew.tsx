/**
 * Original "team of shapes" motif: five abstract geometric people on a
 * baseline. Purely decorative — the visible caption under it carries the
 * meaning, so the drawing itself is hidden from assistive tech.
 */
export function ShapeCrew() {
  return (
    <svg
      viewBox="0 0 540 300"
      className="shape-crew"
      aria-hidden="true"
      focusable="false"
    >
      {/* floating confetti */}
      <circle cx="236" cy="56" r="11" fill="none" stroke="#5257e5" strokeWidth="5" />
      <circle cx="330" cy="96" r="7" fill="#ff5c45" />
      <path d="M472 58l15 26h-30Z" fill="#16a085" />
      <rect x="104" y="44" width="14" height="14" rx="4" fill="#7c80ee" transform="rotate(18 111 51)" />

      {/* ground shadows */}
      <ellipse cx="65" cy="276" rx="48" ry="7" fill="#e2e4f3" />
      <ellipse cx="165" cy="276" rx="56" ry="7" fill="#e2e4f3" />
      <ellipse cx="275" cy="276" rx="40" ry="6" fill="#e2e4f3" />
      <ellipse cx="385" cy="276" rx="60" ry="7" fill="#e2e4f3" />
      <ellipse cx="480" cy="276" rx="42" ry="6" fill="#e2e4f3" />

      {/* arch person */}
      <path d="M25 272v-72a40 40 0 0 1 80 0v72Z" fill="#17182b" />
      <circle cx="65" cy="128" r="27" fill="#5257e5" />

      {/* triangle person */}
      <path d="M165 148l56 124H109Z" fill="#ff5c45" />
      <circle cx="165" cy="114" r="25" fill="#17182b" />

      {/* column person */}
      <rect x="246" y="154" width="58" height="118" rx="29" fill="#16a085" />
      <circle cx="275" cy="119" r="27" fill="#cf4fa4" />

      {/* dome person */}
      <path d="M330 272a55 55 0 0 1 110 0Z" fill="#7c80ee" />
      <circle cx="385" cy="183" r="26" fill="#ff5c45" />

      {/* block person */}
      <rect x="447" y="196" width="66" height="76" rx="18" fill="#cf4fa4" />
      <circle cx="480" cy="162" r="23" fill="#16a085" />
    </svg>
  );
}
