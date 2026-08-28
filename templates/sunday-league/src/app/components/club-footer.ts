import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeasonBoard } from '../services/season-board';

@Component({
  selector: 'app-club-footer',
  templateUrl: './club-footer.html',
  styleUrl: './club-footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClubFooter {
  private readonly board = inject(SeasonBoard);

  protected readonly club = this.board.club;
  protected readonly season = this.board.season;
}
