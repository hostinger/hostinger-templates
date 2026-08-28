import Link from "next/link";
import { getAllEpisodes } from "@/lib/episodes";
import { site } from "@/lib/site";
import { formatDate, formatEpisodeNumber } from "@/lib/format";
import { EpisodeArt } from "@/components/EpisodeArt";
import { EpisodeCard } from "@/components/EpisodeCard";
import { EpisodePlayer } from "@/components/EpisodePlayer";
import { FaqSection } from "@/components/FaqSection";
import styles from "@/app/page.module.css";

export default function HomePage() {
  const episodes = getAllEpisodes();
  const latest = episodes[0];

  return (
    <>
      <section className={`shell ${styles.masthead}`} aria-labelledby="latest-title">
        <div className={styles.mastheadCopy}>
          <p className="eyebrow">
            Latest episode · {formatDate(latest.date)}
          </p>
          <h1 id="latest-title" className={styles.title}>
            {latest.title}
          </h1>
          <p className={styles.guestLine}>with {latest.guest}</p>
          <p className={styles.lede}>{latest.description}</p>
          <EpisodePlayer episode={latest} />
          <p className={styles.transcriptLink}>
            <Link href={`/episodes/${latest.slug}/`}>
              Read and search the transcript →
            </Link>
          </p>
        </div>
        <div className={styles.mastheadArt} aria-hidden="true">
          <span className={styles.bigNumber}>
            {formatEpisodeNumber(latest.number)}
          </span>
          <EpisodeArt episodeNumber={latest.number} className={styles.art} />
        </div>
      </section>

      <section
        id="episodes"
        className={`shell ${styles.episodes}`}
        aria-labelledby="episodes-title"
      >
        <div className={styles.episodesIntro}>
          <p className="eyebrow">The archive</p>
          <h2 id="episodes-title" className={styles.sectionTitle}>
            Every episode
          </h2>
          <p className={styles.sectionNote}>
            {episodes.length} conversations so far. Each one has chapter
            markers and a transcript you can search, so you can jump straight
            to the bit somebody told you about.
          </p>
        </div>
        <ol className={styles.episodeList}>
          {episodes.map((episode) => (
            <EpisodeCard key={episode.slug} episode={episode} />
          ))}
        </ol>
      </section>

      <section
        id="about"
        className={`shell ${styles.about}`}
        aria-labelledby="about-title"
      >
        <div>
          <p className="eyebrow">About the show</p>
          <h2 id="about-title" className={styles.sectionTitle}>
            {site.tagline}
          </h2>
          {site.about.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className={styles.aboutText}>
              {paragraph}
            </p>
          ))}
        </div>
        <div className={styles.hostCard}>
          <p className="eyebrow">Your host</p>
          <h3 className={styles.hostName}>{site.host.name}</h3>
          <p className={styles.hostBio}>{site.host.bio}</p>
          <a href={`mailto:${site.email}`} className={styles.hostMail}>
            {site.email}
          </a>
        </div>
      </section>

      <FaqSection />
    </>
  );
}
