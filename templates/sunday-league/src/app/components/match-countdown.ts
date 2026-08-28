import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SeasonBoard } from '../services/season-board';
import { countdownTo, padUnit } from '../utils/countdown';

@Component({
  selector: 'app-match-countdown',
  templateUrl: './match-countdown.html',
  styleUrl: './match-countdown.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchCountdown {
  private readonly board = inject(SeasonBoard);

  readonly kickoff = input.required<Date>();

  protected readonly parts = computed(() => countdownTo(this.kickoff(), this.board.nowMs()));
  protected readonly pad = padUnit;
}
