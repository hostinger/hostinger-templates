"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/data";
import { IconClose, IconLogo, IconMenu } from "./icons";
import { NavList } from "./NavList";
import styles from "./AppShell.module.css";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (wasOpen.current && !open) triggerRef.current?.focus();
    wasOpen.current = open;
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
      >
        <IconMenu aria-hidden />
      </button>
      {open ? (
        <div
          className={styles.drawerBackdrop}
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className={styles.drawer} role="dialog" aria-modal="true" aria-label="Navigation" id="mobile-nav">
            <div className={styles.drawerHeader}>
              <span className={styles.brand}>
                <span className={styles.logoMark} aria-hidden>
                  <IconLogo />
                </span>
                <span className={styles.brandText}>
                  <span className={styles.brandName}>{site.product}</span>
                  <span className={styles.brandSub}>{site.console}</span>
                </span>
              </span>
              <button
                ref={closeRef}
                type="button"
                className={styles.menuButton}
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
              >
                <IconClose aria-hidden />
              </button>
            </div>
            <NavList onNavigate={() => setOpen(false)} />
            <div className={styles.drawerFooter}>
              <span className={styles.workspaceName}>{site.orgLabel}</span>
              <span className={styles.workspaceMeta}>
                <span className={styles.workspaceDot} aria-hidden />
                {site.workspaceLabel}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
