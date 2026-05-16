import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section__container banner__container">
      <div class="banner__grid">
        <article class="banner__card" *ngFor="let card of cards">
          <div class="banner__card-top">
            <div class="banner__icon"><i [class]="card.icon"></i></div>
            <div>
              <h4>{{ card.title }}</h4>
              <p>{{ card.desc }}</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class BannerComponent {
  readonly cards = [
    {
      icon: 'ri-road-map-line',
      title: 'Explore the World',
      desc: 'A playful map-like portfolio flow inspired by interactive web worlds and built around your real work.',
    },
    {
      icon: 'ri-dashboard-3-line',
      title: 'Data to Decisions',
      desc: 'Dashboards, ML experiments, SQL analysis, and business insights presented as clear portfolio checkpoints.',
    },
    {
      icon: 'ri-code-box-line',
      title: 'Build with Purpose',
      desc: 'Full-stack projects, polished interfaces, and practical engineering choices.',
    },
  ];
}
