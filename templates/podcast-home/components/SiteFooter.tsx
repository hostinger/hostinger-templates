import { site } from "@/lib/site";
import { getWaveformBars } from "@/lib/waveform";
import { WaveformBars } from "@/components/WaveformBars";
import { WaveMark } from "@/components/icons";
import styles from "@/components/SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <WaveformBars bars={getWaveformBars(42, 160)} className={styles.strip} />
      <div className={`shell ${styles.inner}`}>
        <div className={styles.brandCol}>
          <p className={styles.brand}>
            <WaveMark className={styles.mark} />
            {site.showName}
          </p>
          <p className={styles.tagline}>{site.tagline}</p>
        </div>
        <div className={styles.col}>
          <h2 className={styles.colTitle}>Write to the studio</h2>
          <a href={`mailto:${site.email}`} className={styles.mail}>
            {site.email}
          </a>
          <p className={styles.note}>
            Guest tips, corrections, and transcript requests all land in the
            same inbox.
          </p>
        </div>
        <div className={styles.col}>
          <h2 className={styles.colTitle}>Elsewhere</h2>
          <ul className={styles.socials}>
            {site.socials.map((social) => (
              <li key={social.label}>
                <a href={social.href} className={styles.social}>
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={`shell ${styles.smallPrint}`}>
        <p>
          © {new Date().getFullYear()} {site.showName}. Recorded wherever the
          making happens.
        </p>
      </div>
    </footer>
  );
}
