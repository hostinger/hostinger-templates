import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SeasonBoard } from '../services/season-board';
import type { Fixture, FixtureResult } from '../models/content';

type Outcome = 'win' | 'draw' | 'loss';

const OUTCOME_WORDS: Record<Outcome, string> = {
  win: 'Won',
  draw: 'Drew',
  loss: 'Lost',
};

@Component({
  selector: 'app-fixture-list',
  imports: [DatePipe],
  templateUrl: './fixture-list.html',
  styleUrl: './fixture-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FixtureList {
  private readonly board = inject(SeasonBoard);

  protected readonly club = this.board.club;
  protected readonly season = this.board.season;
  protected readonly played = this.board.played;
  protected readonly later = this.board.laterFixtures;
  protected readonly seasonComplete = this.board.seasonComplete;

  /** "Ashcombe Rovers 3–1 Hartfield Sports" for results, "A v B" before then. */
  protected matchLine(fixture: Fixture): string {
    const us = this.club.shortName;
    const { result, opponent } = fixture;
    if (!result) {
      return fixture.homeAway === 'home' ? `${us} v ${opponent}` : `${opponent} v ${us}`;
    }
    return fixture.homeAway === 'home'
      ? `${us} ${result.goalsFor}–${result.goalsAgainst} ${opponent}`
      : `${opponent} ${result.goalsAgainst}–${result.goalsFor} ${us}`;
  }

  protected outcome(result: FixtureResult): Outcome {
    if (result.goalsFor > result.goalsAgainst) {
      return 'win';
    }
    return result.goalsFor < result.goalsAgainst ? 'loss' : 'draw';
  }

  protected outcomeWord(result: FixtureResult): string {
    return OUTCOME_WORDS[this.outcome(result)];
  }

  protected chipClass(result: FixtureResult): string {
    return `result-chip is-${this.outcome(result)}`;
  }
}
