import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { scrollToSection } from '../../shared/section-navigation';

type Theme = 'dark' | 'light';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly navLinks = [
    { id: 'home',    label: 'Home'     },
    { id: 'about',   label: 'About'    },
    { id: 'resume',  label: 'Resume'   },
    { id: 'project', label: 'Projects' },
    { id: 'service', label: 'Skills'   },
    { id: 'blog',    label: 'Blog'     },
    { id: 'contact', label: 'Contact'  },
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
          if (ratio > bestRatio) { bestId = id; bestRatio = ratio; }
        });
        this.activeSection = bestId;
      },
      { threshold: [0, 0.2, 0.5, 0.8] },
    );
    document.querySelectorAll('section[id], header[id]').forEach((s) => this.observer?.observe(s));
  }
}
