import Link from "next/link";
import { site } from "@/lib/site";
import { WaveMark } from "@/components/icons";
import styles from "@/components/SiteHeader.module.css";

const NAV_LINKS = [
  { label: "Episodes", href: "/#episodes" },
  { label: "About", href: "/#about" },
  { label: "FAQ", href: "/#faq" },
];

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`shell ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          <WaveMark className={styles.mark} />
          <span>{site.showName}</span>
        </Link>
        <nav aria-label="Site" className={styles.nav}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>
        <a href={`mailto:${site.email}`} className={styles.write}>
          Write in
        </a>
      </div>
    </header>
  );
}
