import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SeasonBoard } from '../services/season-board';

@Component({
  selector: 'app-club-header',
  imports: [DatePipe],
  templateUrl: './club-header.html',
  styleUrl: './club-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClubHeader {
  private readonly board = inject(SeasonBoard);

  protected readonly club = this.board.club;
  protected readonly season = this.board.season;
}
