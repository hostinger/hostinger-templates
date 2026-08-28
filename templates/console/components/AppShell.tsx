import { org, site } from "@/lib/data";
import { IconLogo } from "./icons";
import { MobileNav } from "./MobileNav";
import { NavList } from "./NavList";
import styles from "./AppShell.module.css";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.logoMark} aria-hidden>
            <IconLogo />
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>{site.product}</span>
            <span className={styles.brandSub}>{site.console}</span>
          </span>
        </div>
        <NavList />
        <div className={styles.sidebarFooter}>
          <div className={styles.workspaceCard}>
            <span className={styles.workspaceName}>{site.orgLabel}</span>
            <span className={styles.workspaceMeta}>
              <span className={styles.workspaceDot} aria-hidden />
              {site.workspaceLabel}
            </span>
          </div>
          <div className={styles.user}>
            <span className={styles.avatar} aria-hidden>
              {org.profile.initials}
            </span>
            <span className={styles.userText}>
              <span className={styles.userName}>{org.profile.name}</span>
              <span className={styles.userRole}>{org.profile.role}</span>
            </span>
          </div>
        </div>
      </aside>
      <div className={styles.mainColumn}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <MobileNav />
            <span className={styles.topbarBrand}>
              <span className={styles.logoMark} aria-hidden>
                <IconLogo />
              </span>
              <span className={styles.topbarBrandName}>{site.product}</span>
            </span>
            <span className={styles.breadcrumb}>
              {site.orgLabel}
              <span className={styles.breadcrumbSep} aria-hidden>
                /
              </span>
              {site.workspaceLabel}
            </span>
          </div>
          <div className={styles.topbarRight}>
            <span className={styles.demoBadge}>
              <span className={styles.demoDot} aria-hidden />
              {site.demoBadge}
            </span>
            <span className={styles.avatarSmall} aria-hidden>
              {org.profile.initials}
            </span>
            <span className="sr-only">Signed in as {org.profile.name}</span>
          </div>
        </header>
        <main id="main" className={styles.main}>
          {children}
        </main>
        <footer className={styles.footer}>
          <p>{site.footerNote}</p>
        </footer>
      </div>
    </div>
  );
}
