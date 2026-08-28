import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps): IconProps {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    ...props,
  };
}

/** Windrose mark: a long compass star over its 45°-rotated echo. */
export function IconLogo(props: IconProps) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path
        opacity={0.42}
        d="M12 6.6 L13.3 10.7 L17.4 12 L13.3 13.3 L12 17.4 L10.7 13.3 L6.6 12 L10.7 10.7 Z"
        transform="rotate(45 12 12)"
      />
      <path d="M12 1.6 L14 10 L22.4 12 L14 14 L12 22.4 L10 14 L1.6 12 L10 10 Z" />
    </svg>
  );
}

export function IconGrid(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="3" width="6" height="6" rx="1.5" />
      <rect x="11" y="3" width="6" height="6" rx="1.5" />
      <rect x="3" y="11" width="6" height="6" rx="1.5" />
      <rect x="11" y="11" width="6" height="6" rx="1.5" />
    </svg>
  );
}

export function IconRows(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="4" cy="5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="10" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="15" r="1.1" fill="currentColor" stroke="none" />
      <path d="M7.5 5h9.5M7.5 10h9.5M7.5 15h9.5" />
    </svg>
  );
}

export function IconSliders(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 5.5h6.4M13.6 5.5H17M3 14.5h3.4M10.6 14.5H17M3 10h9.4" />
      <circle cx="11.6" cy="5.5" r="2" />
      <circle cx="8.6" cy="14.5" r="2" />
      <circle cx="14.4" cy="10" r="2" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 5.5h13M3.5 10h13M3.5 14.5h13" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}

export function IconArrowUp(props: IconProps) {
  return (
    <svg {...base({ width: 12, height: 12, ...props })}>
      <path d="M10 16V4M4.5 9.5 10 4l5.5 5.5" />
    </svg>
  );
}

export function IconArrowDown(props: IconProps) {
  return (
    <svg {...base({ width: 12, height: 12, ...props })}>
      <path d="M10 4v12M4.5 10.5 10 16l5.5-5.5" />
    </svg>
  );
}

export function IconSortAsc(props: IconProps) {
  return (
    <svg {...base({ width: 14, height: 14, viewBox: "0 0 16 16", strokeWidth: 1.8, ...props })}>
      <path d="M3.5 10 8 5.5l4.5 4.5" />
    </svg>
  );
}

export function IconSortDesc(props: IconProps) {
  return (
    <svg {...base({ width: 14, height: 14, viewBox: "0 0 16 16", strokeWidth: 1.8, ...props })}>
      <path d="M3.5 6 8 10.5 12.5 6" />
    </svg>
  );
}

export function IconSortBoth(props: IconProps) {
  return (
    <svg {...base({ width: 14, height: 14, viewBox: "0 0 16 16", strokeWidth: 1.8, ...props })}>
      <path d="M4.5 6.2 8 2.9l3.5 3.3M4.5 9.8 8 13.1l3.5-3.3" />
    </svg>
  );
}

export function IconDeploy(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="10" cy="10" r="7" />
      <path d="M10 13.5V7M7.2 9.4 10 6.6l2.8 2.8" />
    </svg>
  );
}

export function IconUser(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="10" cy="6.8" r="2.9" />
      <path d="M4.2 16.4c.9-3 3.1-4.6 5.8-4.6s4.9 1.6 5.8 4.6" />
    </svg>
  );
}

export function IconTarget(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="10" cy="10" r="6.6" />
      <circle cx="10" cy="10" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconAlert(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10 3.4 17.4 16H2.6L10 3.4Z" />
      <path d="M10 8.4v3.4" />
      <circle cx="10" cy="14" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
