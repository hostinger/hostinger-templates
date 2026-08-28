import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SeasonBoard } from '../services/season-board';
import { MatchCountdown } from './match-countdown';

@Component({
  selector: 'app-next-match',
  imports: [DatePipe, MatchCountdown],
  templateUrl: './next-match.html',
  styleUrl: './next-match.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextMatch {
  private readonly board = inject(SeasonBoard);

  protected readonly club = this.board.club;
  protected readonly season = this.board.season;
  protected readonly fixture = this.board.nextFixture;

  protected readonly homeTeam = computed(() => {
    const fixture = this.fixture();
    if (!fixture) {
      return '';
    }
    return fixture.homeAway === 'home' ? this.club.shortName : fixture.opponent;
  });

  protected readonly awayTeam = computed(() => {
    const fixture = this.fixture();
    if (!fixture) {
      return '';
    }
    return fixture.homeAway === 'home' ? fixture.opponent : this.club.shortName;
  });

  protected readonly homeCrest = computed(() => this.board.crestFor(this.homeTeam()));
  protected readonly awayCrest = computed(() => this.board.crestFor(this.awayTeam()));
}
