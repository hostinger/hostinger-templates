import Link from "next/link";
import type { Episode } from "@/lib/types";
import { formatDate, formatEpisodeNumber, formatTime } from "@/lib/format";
import { getWaveformBars } from "@/lib/waveform";
import { EpisodeArt } from "@/components/EpisodeArt";
import { WaveformBars } from "@/components/WaveformBars";
import styles from "@/components/EpisodeCard.module.css";

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <li className={styles.item}>
      <Link href={`/episodes/${episode.slug}/`} className={styles.card}>
        <div className={styles.artWrap}>
          <EpisodeArt episodeNumber={episode.number} className={styles.art} />
          <span className={styles.number} aria-hidden="true">
            {formatEpisodeNumber(episode.number)}
          </span>
        </div>
        <div className={styles.body}>
          <p className={styles.kicker}>
            EP {formatEpisodeNumber(episode.number)} · {formatDate(episode.date)}
          </p>
          <h3 className={styles.title}>{episode.title}</h3>
          <p className={styles.guest}>with {episode.guest}</p>
          <WaveformBars
            bars={getWaveformBars(episode.number, 56)}
            className={styles.wave}
          />
          <p className={styles.meta}>
            {formatTime(episode.duration)} · {episode.chapters.length} chapters ·
            transcript
          </p>
        </div>
      </Link>
    </li>
  );
}
