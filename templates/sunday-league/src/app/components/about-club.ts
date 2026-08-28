import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeasonBoard } from '../services/season-board';

@Component({
  selector: 'app-about-club',
  templateUrl: './about-club.html',
  styleUrl: './about-club.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutClub {
  protected readonly club = inject(SeasonBoard).club;
}
