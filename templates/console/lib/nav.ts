export type NavIcon = "overview" | "events" | "settings";

export interface NavItem {
  href: string;
  label: string;
  icon: NavIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Overview", icon: "overview" },
  { href: "/events/", label: "Events", icon: "events" },
  { href: "/settings/", label: "Settings", icon: "settings" },
];

/** Trailing-slash-insensitive active check for sidebar and drawer links. */
export function isActivePath(pathname: string, href: string): boolean {
  const normalize = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : "/");
  return normalize(pathname) === normalize(href);
}
