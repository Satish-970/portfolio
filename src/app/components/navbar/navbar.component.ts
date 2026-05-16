import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { scrollToSection } from '../../shared/section-navigation';

type Theme = 'dark' | 'light';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar-futuristic">
      <div class="nav__bar">
        <div class="nav__header">
          <a href="/home" class="nav-logo-link" aria-label="Satish Pakalapati home" (click)="goTo($event, 'home')">
            <img class="nav-logo-gif" src="assets/logo.gif" alt="Satish Pakalapati logo" />
          </a>
          <button class="nav__menu__btn" type="button" aria-label="Toggle navigation" (click)="isMenuOpen = !isMenuOpen">
            <i [class]="isMenuOpen ? 'ri-close-line' : 'ri-menu-3-line'"></i>
          </button>
        </div>

        <ul class="nav__links" [class.open]="isMenuOpen">
          <li *ngFor="let link of navLinks" class="link" [class.btn]="link.isButton" [class.active]="activeSection === link.id">
            <a [href]="'/' + link.id" (click)="goTo($event, link.id)">
              <span>{{ link.label }}</span>
              <span *ngIf="activeSection === link.id && !link.isButton" class="active-line"></span>
            </a>
          </li>
          <li>
            <button class="theme-switch" type="button" (click)="toggleTheme()" [attr.aria-label]="'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme'">
              <i [class]="theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'"></i>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  `,
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'resume', label: 'Resume' },
    { id: 'project', label: 'Projects' },
    { id: 'service', label: 'Skills' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact', isButton: true },
  ];

  theme: Theme = 'dark';
  isMenuOpen = false;
  activeSection = 'home';

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('portfolio-theme') as Theme | null;
    this.theme = savedTheme === 'light' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', this.theme);
    this.activeSection = window.location.hash.replace('#', '') || 'home';
  }

  ngAfterViewInit(): void {
    this.observeSections();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  toggleTheme(): void {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('portfolio-theme', this.theme);
    document.body.setAttribute('data-theme', this.theme);
  }

  goTo(event: Event, id: string): void {
    event.preventDefault();
    this.isMenuOpen = false;
    this.activeSection = id;
    scrollToSection(id);
  }

  private observeSections(): void {
    const visibility = new Map<string, number>();
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
        let bestId = this.activeSection;
        let bestRatio = 0;
        visibility.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestId = id;
            bestRatio = ratio;
          }
        });
        this.activeSection = bestId;
      },
      { threshold: [0, 0.2, 0.5, 0.8] },
    );

    document.querySelectorAll('section[id], header[id]').forEach((section) => this.observer?.observe(section));
  }
}
