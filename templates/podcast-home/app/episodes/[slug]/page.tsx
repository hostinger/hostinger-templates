import type { Metadata } from "next";
import Link from "next/link";
import { getAllEpisodes, getEpisodeBySlug } from "@/lib/episodes";
import { site } from "@/lib/site";
import { formatDate, formatEpisodeNumber, formatTime } from "@/lib/format";
import { EpisodeArt } from "@/components/EpisodeArt";
import { EpisodePlayer } from "@/components/EpisodePlayer";
import { TranscriptSearch } from "@/components/TranscriptSearch";
import styles from "@/app/episodes/[slug]/page.module.css";

interface EpisodePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllEpisodes().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: EpisodePageProps): Promise<Metadata> {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);
  return {
    title: `EP ${formatEpisodeNumber(episode.number)}: ${episode.title}`,
    description: episode.description,
  };
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);
  const episodes = getAllEpisodes();
  const index = episodes.findIndex((entry) => entry.slug === slug);
  const newer = index > 0 ? episodes[index - 1] : null;
  const older = index < episodes.length - 1 ? episodes[index + 1] : null;

  return (
    <article>
      <header className={`shell ${styles.hero}`}>
        <div className={styles.heroCopy}>
          <p className={styles.crumb}>
            <Link href="/#episodes">← All episodes</Link>
          </p>
          <p className="eyebrow">
            EP {formatEpisodeNumber(episode.number)} · {formatDate(episode.date)} ·{" "}
            {formatTime(episode.duration)}
          </p>
          <h1 className={styles.title}>{episode.title}</h1>
          <p className={styles.guestLine}>with {episode.guest}</p>
          <p className={styles.lede}>{episode.description}</p>
        </div>
        <div className={styles.heroArt} aria-hidden="true">
          <span className={styles.bigNumber}>
            {formatEpisodeNumber(episode.number)}
          </span>
          <EpisodeArt episodeNumber={episode.number} className={styles.art} />
        </div>
      </header>

      <section className={`shell ${styles.playerSection}`} aria-label="Listen">
        <EpisodePlayer episode={episode} />
      </section>

      <section
        className={`shell ${styles.transcriptSection}`}
        aria-labelledby="transcript-title"
      >
        <div className={styles.transcriptIntro}>
          <p className="eyebrow">Read along</p>
          <h2 id="transcript-title" className={styles.transcriptTitle}>
            Transcript
          </h2>
          <p className={styles.transcriptNote}>
            An excerpt while the full transcript is proofread. Search it — the
            first match scrolls into view.
          </p>
        </div>
        <TranscriptSearch
          segments={episode.transcript}
          hostName={site.host.name}
        />
      </section>

      <nav className={`shell ${styles.pager}`} aria-label="More episodes">
        {newer ? (
          <Link href={`/episodes/${newer.slug}/`} className={styles.pagerLink}>
            <span className={styles.pagerLabel}>← Newer</span>
            <span className={styles.pagerTitle}>{newer.title}</span>
          </Link>
        ) : (
          <span className={styles.pagerSpacer} />
        )}
        {older ? (
          <Link
            href={`/episodes/${older.slug}/`}
            className={`${styles.pagerLink} ${styles.pagerRight}`}
          >
            <span className={styles.pagerLabel}>Older →</span>
            <span className={styles.pagerTitle}>{older.title}</span>
          </Link>
        ) : (
          <span className={styles.pagerSpacer} />
        )}
      </nav>
    </article>
  );
}
