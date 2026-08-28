import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Chapter, Episode, TranscriptSegment } from "@/lib/types";

const EPISODES_DIR = path.join(process.cwd(), "content", "episodes");

/** Matches dialogue paragraphs shaped like `**Speaker:** line of dialogue`. */
const SPEAKER_PATTERN = /^\*\*(.+?):\*\*\s*([\s\S]+)$/;

function parseTranscript(body: string): TranscriptSegment[] {
  return body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter((paragraph) => paragraph.length > 0)
    .map((paragraph) => {
      const match = paragraph.match(SPEAKER_PATTERN);
      if (!match) {
        return { speaker: "", text: paragraph };
      }
      return { speaker: match[1].trim(), text: match[2].trim() };
    });
}

function parseChapters(raw: unknown, slug: string): Chapter[] {
  if (!Array.isArray(raw)) {
    throw new Error(`Episode "${slug}" is missing a chapters list.`);
  }
  return raw.map((entry) => {
    const { title, start } = entry as { title?: unknown; start?: unknown };
    if (typeof title !== "string" || typeof start !== "number") {
      throw new Error(
        `Episode "${slug}" has a chapter without a title or numeric start.`,
      );
    }
    return { title, start };
  });
}

function readEpisode(fileName: string): Episode {
  const slug = fileName.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(EPISODES_DIR, fileName), "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: String(data.title),
    number: Number(data.number),
    date: String(data.date),
    duration: Number(data.duration),
    audio: String(data.audio),
    guest: String(data.guest),
    description: String(data.description),
    chapters: parseChapters(data.chapters, slug),
    transcript: parseTranscript(content),
  };
}

/** All episodes, newest (highest number) first. */
export function getAllEpisodes(): Episode[] {
  return fs
    .readdirSync(EPISODES_DIR)
    .filter((fileName) => fileName.endsWith(".md"))
    .map(readEpisode)
    .sort((a, b) => b.number - a.number);
}

export function getEpisodeBySlug(slug: string): Episode {
  const episode = getAllEpisodes().find((entry) => entry.slug === slug);
  if (!episode) {
    throw new Error(`No episode found for slug "${slug}".`);
  }
  return episode;
}

export function getLatestEpisode(): Episode {
  return getAllEpisodes()[0];
}
