"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { NAV_ITEMS, isActivePath, type NavIcon } from "@/lib/nav";
import { IconGrid, IconRows, IconSliders } from "./icons";
import styles from "./AppShell.module.css";

const NAV_ICONS: Record<NavIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  overview: IconGrid,
  events: IconRows,
  settings: IconSliders,
};

export function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Primary">
      <ul className={styles.navList}>
        {NAV_ITEMS.map((item) => {
          const Icon = NAV_ICONS[item.icon];
          const active = isActivePath(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={active ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
                aria-current={active ? "page" : undefined}
                onClick={onNavigate}
              >
                <Icon className={styles.navIcon} aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
