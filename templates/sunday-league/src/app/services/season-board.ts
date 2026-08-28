import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { CLUB, SEASON } from '../content';

const TICK_MS = 1000;

/**
 * The club clock and everything derived from it: which fixtures have been
 * played, which are still to come, and the next kick-off pinned to the board.
 * Nothing is hardcoded as "next" — it is always computed from kick-off times.
 */
@Injectable({ providedIn: 'root' })
export class SeasonBoard {
  readonly club = CLUB;
  readonly season = SEASON;

  private readonly now = signal(Date.now());

  /** Milliseconds since the epoch, ticking once a second. */
  readonly nowMs = this.now.asReadonly();

  /** Fixtures whose kick-off is still ahead, soonest first. */
  readonly upcoming = computed(() =>
    this.season.fixtures
      .filter((fixture) => fixture.kickoff.getTime() > this.now())
      .sort((a, b) => a.kickoff.getTime() - b.kickoff.getTime()),
  );

  /** Fixtures that have kicked off, most recent first. */
  readonly played = computed(() =>
    this.season.fixtures
      .filter((fixture) => fixture.kickoff.getTime() <= this.now())
      .sort((a, b) => b.kickoff.getTime() - a.kickoff.getTime()),
  );

  /** The fixture pinned to the top of the board, or null once the season is done. */
  readonly nextFixture = computed(() => this.upcoming().at(0) ?? null);

  /** Upcoming fixtures beyond the pinned one. */
  readonly laterFixtures = computed(() => this.upcoming().slice(1));

  readonly seasonComplete = computed(() => this.upcoming().length === 0);

  constructor() {
    const timer = setInterval(() => this.now.set(Date.now()), TICK_MS);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  /** Crest path for a team named in the table, falling back to the club crest. */
  crestFor(teamName: string): string {
    return this.season.teams.find((team) => team.name === teamName)?.crest ?? this.club.crest;
  }
}
