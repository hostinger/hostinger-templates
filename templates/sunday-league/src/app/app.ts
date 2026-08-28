import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CLUB } from './content';
import { FaqJsonLd } from './services/faq-jsonld';
import { AboutClub } from './components/about-club';
import { ClubFooter } from './components/club-footer';
import { ClubHeader } from './components/club-header';
import { FaqSection } from './components/faq-section';
import { FixtureList } from './components/fixture-list';
import { LeagueTable } from './components/league-table';
import { NextMatch } from './components/next-match';

@Component({
  selector: 'app-root',
  imports: [ClubHeader, NextMatch, LeagueTable, FixtureList, AboutClub, FaqSection, ClubFooter],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  constructor() {
    inject(Title).setTitle(`${CLUB.name} · Sunday League Noticeboard`);
    inject(FaqJsonLd).register(CLUB.faqs);
  }
}
