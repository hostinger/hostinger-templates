"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Episode } from "@/lib/types";
import { formatTime } from "@/lib/format";
import { getWaveformBars } from "@/lib/waveform";
import { WaveformBars } from "@/components/WaveformBars";
import { PauseIcon, PlayIcon } from "@/components/icons";
import styles from "@/components/EpisodePlayer.module.css";

interface EpisodePlayerProps {
  episode: Episode;
}

const TIMELINE_BARS = 110;

export function EpisodePlayer({ episode }: EpisodePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(episode.duration);

  const bars = useMemo(
    () => getWaveformBars(episode.number, TIMELINE_BARS),
    [episode.number],
  );

  // Smooth playhead: while playing, mirror the audio clock every frame.
  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    let frame = 0;
    const tick = () => {
      const audio = audioRef.current;
      if (audio) {
        setCurrentTime(audio.currentTime);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isPlaying]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (audio.paused) {
      audio.play().catch(() => {
        // Leave the player paused if the browser refuses playback.
      });
    } else {
      audio.pause();
    }
  };

  const seekTo = (seconds: number, startPlaying: boolean) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    const clamped = Math.min(Math.max(seconds, 0), duration);
    audio.currentTime = clamped;
    setCurrentTime(clamped);
    if (startPlaying && audio.paused) {
      audio.play().catch(() => {
        // Ignore refused playback; the jump alone still worked.
      });
    }
  };

  const activeChapterIndex = (() => {
    let active = 0;
    episode.chapters.forEach((chapter, index) => {
      if (currentTime >= chapter.start) {
        active = index;
      }
    });
    return active;
  })();

  return (
    <div
      className={styles.player}
      role="group"
      aria-label={`Audio player: ${episode.title}`}
    >
      <div className={styles.transport}>
        <button
          type="button"
          className={styles.playButton}
          onClick={togglePlayback}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <PauseIcon className={styles.playIcon} />
          ) : (
            <PlayIcon className={styles.playIcon} />
          )}
        </button>
        <div className={styles.readout}>
          <p className={styles.time}>
            <span className={styles.timeNow}>{formatTime(currentTime)}</span>
            <span aria-hidden="true"> / </span>
            {formatTime(duration)}
          </p>
          <p className={styles.nowChapter}>
            {episode.chapters[activeChapterIndex]?.title}
          </p>
        </div>
      </div>

      <div className={styles.timeline}>
        <WaveformBars
          bars={bars}
          progress={duration > 0 ? currentTime / duration : 0}
          className={styles.wave}
        />
        <input
          type="range"
          className={styles.scrub}
          min={0}
          max={duration}
          step={1}
          value={Math.min(currentTime, duration)}
          onChange={(event) => seekTo(Number(event.target.value), false)}
          aria-label="Seek within episode"
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        />
        {episode.chapters.map((chapter, index) => (
          <button
            key={chapter.start}
            type="button"
            className={
              index <= activeChapterIndex ? `${styles.pip} ${styles.pipPassed}` : styles.pip
            }
            style={{ left: `${(chapter.start / duration) * 100}%` }}
            onClick={() => seekTo(chapter.start, true)}
            aria-label={`Jump to chapter: ${chapter.title} (${formatTime(chapter.start)})`}
            title={`${chapter.title} · ${formatTime(chapter.start)}`}
          />
        ))}
      </div>

      <ol className={styles.chapters}>
        {episode.chapters.map((chapter, index) => (
          <li key={chapter.start}>
            <button
              type="button"
              className={
                index === activeChapterIndex
                  ? `${styles.chapter} ${styles.chapterActive}`
                  : styles.chapter
              }
              onClick={() => seekTo(chapter.start, true)}
              aria-current={index === activeChapterIndex ? "true" : undefined}
            >
              <span className={styles.chapterIndex} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={styles.chapterTitle}>{chapter.title}</span>
              <span className={styles.chapterTime}>{formatTime(chapter.start)}</span>
            </button>
          </li>
        ))}
      </ol>

      <audio
        ref={audioRef}
        src={episode.audio}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => {
          const realDuration = event.currentTarget.duration;
          if (Number.isFinite(realDuration) && realDuration > 0) {
            setDuration(realDuration);
          }
        }}
      />
    </div>
  );
}
