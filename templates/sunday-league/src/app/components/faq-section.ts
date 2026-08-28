import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeasonBoard } from '../services/season-board';

@Component({
  selector: 'app-faq-section',
  templateUrl: './faq-section.html',
  styleUrl: './faq-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqSection {
  protected readonly faqs = inject(SeasonBoard).club.faqs;
}
