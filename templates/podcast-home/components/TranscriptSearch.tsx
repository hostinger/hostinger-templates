"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { TranscriptSegment } from "@/lib/types";
import { ClearIcon, SearchIcon } from "@/components/icons";
import styles from "@/components/TranscriptSearch.module.css";

interface TranscriptSearchProps {
  segments: TranscriptSegment[];
  hostName: string;
}

const MIN_QUERY_LENGTH = 2;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Transcript labels use first names, so "Mara" should match host "Mara Voss". */
function isHostSpeaker(speaker: string, hostName: string): boolean {
  return (
    speaker.length > 0 &&
    hostName.toLowerCase().startsWith(speaker.toLowerCase())
  );
}

function highlight(text: string, query: string): ReactNode {
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "gi"));
  return parts.map((part, index) =>
    index % 2 === 1 ? <mark key={index}>{part}</mark> : part,
  );
}

export function TranscriptSearch({ segments, hostName }: TranscriptSearchProps) {
  const inputId = useId();
  const transcriptRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim();
  const isSearching = normalizedQuery.length >= MIN_QUERY_LENGTH;

  const matchCount = useMemo(() => {
    if (!isSearching) {
      return 0;
    }
    const pattern = new RegExp(escapeRegExp(normalizedQuery), "gi");
    return segments.reduce(
      (total, segment) => total + (segment.text.match(pattern)?.length ?? 0),
      0,
    );
  }, [isSearching, normalizedQuery, segments]);

  // After each search render, bring the first highlighted match into view.
  useEffect(() => {
    if (!isSearching) {
      return;
    }
    const firstMatch = transcriptRef.current?.querySelector("mark");
    if (!firstMatch) {
      return;
    }
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    firstMatch.scrollIntoView({
      block: "center",
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [isSearching, normalizedQuery]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBar}>
        <label htmlFor={inputId} className="visually-hidden">
          Search this transcript
        </label>
        <SearchIcon className={styles.searchIcon} />
        <input
          id={inputId}
          type="search"
          className={styles.input}
          placeholder="Search the transcript…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
        />
        {query.length > 0 && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            <ClearIcon />
          </button>
        )}
      </div>
      <p role="status" className={styles.status}>
        {isSearching &&
          (matchCount === 0
            ? `No matches for “${normalizedQuery}”`
            : `${matchCount} ${matchCount === 1 ? "match" : "matches"} for “${normalizedQuery}” — first one scrolled into view`)}
      </p>
      <div ref={transcriptRef} className={styles.transcript}>
        {segments.map((segment, index) => (
          <div
            key={index}
            className={
              isHostSpeaker(segment.speaker, hostName)
                ? `${styles.turn} ${styles.turnHost}`
                : styles.turn
            }
          >
            {segment.speaker.length > 0 && (
              <p className={styles.speaker}>{segment.speaker}</p>
            )}
            <p className={styles.text}>
              {isSearching ? highlight(segment.text, normalizedQuery) : segment.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
