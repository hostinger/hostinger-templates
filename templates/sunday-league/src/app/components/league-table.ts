import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SeasonBoard } from '../services/season-board';
import { formatSigned, goalDifference } from '../utils/standings';
import type { TeamStanding } from '../models/content';

@Component({
  selector: 'app-league-table',
  imports: [DatePipe],
  templateUrl: './league-table.html',
  styleUrl: './league-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeagueTable {
  private readonly board = inject(SeasonBoard);

  protected readonly club = this.board.club;
  protected readonly season = this.board.season;
  protected readonly teams = this.board.season.teams;

  protected goalDifferenceLabel(team: TeamStanding): string {
    return formatSigned(goalDifference(team));
  }

  protected isClub(team: TeamStanding): boolean {
    return team.name === this.club.shortName;
  }
}
