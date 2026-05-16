import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AboutComponent } from './components/about/about.component';
import { BannerComponent } from './components/banner/banner.component';
import { BlogComponent } from './components/blog/blog.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeroComponent } from './components/hero/hero.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ResumeComponent } from './components/resume/resume.component';
import { ScrollTopComponent } from './components/scroll-top/scroll-top.component';
import { SkillsComponent } from './components/skills/skills.component';
import { scrollToSection } from './shared/section-navigation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent, HeroComponent, BannerComponent, AboutComponent,
    ResumeComponent, ProjectsComponent, SkillsComponent, BlogComponent,
    ContactComponent, FooterComponent, ScrollTopComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cursor')   cursorEl!:  ElementRef<HTMLDivElement>;
  @ViewChild('preloader') preloaderEl!: ElementRef<HTMLDivElement>;
  @ViewChild('quoteEl')   quoteEl!:   ElementRef<HTMLParagraphElement>;
  @ViewChild('authorEl')  authorEl!:  ElementRef<HTMLSpanElement>;
  @ViewChild('barEl')     barEl!:     ElementRef<HTMLDivElement>;

  private cx = 0; private cy = 0;
  private raf = 0;

  // Quote of the day — same quote all day, changes at midnight
  private readonly quotes = [
    { text: "What we observe is not nature itself, but nature exposed to our method of questioning.", author: "— Werner Heisenberg" },
    { text: "If you can't measure it, you can't improve it.", author: "— Lord Kelvin" },
    { text: "The most incomprehensible thing about the world is that it is comprehensible.", author: "— Albert Einstein" },
    { text: "An experiment is a question which science poses to nature, and a measurement is the recording of nature's answer.", author: "— Max Planck" },
    { text: "In mathematics you don't understand things. You just get used to them.", author: "— John von Neumann" },
    { text: "The good thing about science is that it's true whether or not you believe in it.", author: "— Neil deGrasse Tyson" },
    { text: "Equipped with his five senses, man explores the universe around him and calls the adventure science.", author: "— Edwin Hubble" },
    { text: "The art of doing mathematics consists in finding that special case which contains all the germs of generality.", author: "— David Hilbert" },
    { text: "Nature uses only the longest threads to weave her patterns, so each small piece of her fabric reveals the organization of the entire tapestry.", author: "— Richard Feynman" },
    { text: "Everything should be made as simple as possible, but not simpler.", author: "— Albert Einstein" },
    { text: "The measure of intelligence is the ability to change.", author: "— Charles Darwin" },
    { text: "Somewhere, something incredible is waiting to be known.", author: "— Carl Sagan" },
  ];

  private readonly updateViewportSize = (): void => {
    const w = window.visualViewport?.width  ?? window.innerWidth;
    const h = window.visualViewport?.height ?? window.innerHeight;
    document.documentElement.style.setProperty('--device-width',  `${w}px`);
    document.documentElement.style.setProperty('--device-height', `${h}px`);
  };

  ngOnInit(): void {
    this.updateViewportSize();
    window.addEventListener('resize', this.updateViewportSize, { passive: true });
    window.visualViewport?.addEventListener('resize', this.updateViewportSize, { passive: true });
  }

  ngAfterViewInit(): void {
    const id = window.location.pathname.replace('/', '') || 'home';
    if (id && id !== '/') setTimeout(() => scrollToSection(id), 0);
    this.initCursor();
    this.initPreloader();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.updateViewportSize);
    window.visualViewport?.removeEventListener('resize', this.updateViewportSize);
    cancelAnimationFrame(this.raf);
    window.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseleave', this.onMouseLeave);
    document.removeEventListener('mouseenter', this.onMouseEnter);
  }

  private onMouseMove  = (e: MouseEvent) => { this.cx = e.clientX; this.cy = e.clientY; };
  private onMouseLeave = () => this.cursorEl.nativeElement.classList.remove('cursor--visible');
  private onMouseEnter = () => this.cursorEl.nativeElement.classList.add('cursor--visible');

  private initCursor(): void {
    const el = this.cursorEl.nativeElement;

    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    document.addEventListener('mouseleave', this.onMouseLeave);
    document.addEventListener('mouseenter', this.onMouseEnter);

    // show on first move
    window.addEventListener('mousemove', () => el.classList.add('cursor--visible'), { once: true });

    const hoverSel = 'a, button, [role="button"], input, textarea, select, label';
    document.addEventListener('mouseover', (e) => {
      if ((e.target as Element).closest(hoverSel)) el.classList.add('cursor--hover');
    }, { passive: true });
    document.addEventListener('mouseout', (e) => {
      if ((e.target as Element).closest(hoverSel)) el.classList.remove('cursor--hover');
    }, { passive: true });

    // instant position — no lag, no transition
    const tick = () => {
      this.raf = requestAnimationFrame(tick);
      el.style.transform = `translate(${this.cx}px, ${this.cy}px)`;
    };
    tick();
  }

  private initPreloader(): void {
    const preloader = this.preloaderEl.nativeElement;
    const quoteEl   = this.quoteEl.nativeElement;
    const authorEl  = this.authorEl.nativeElement;
    const bar       = this.barEl.nativeElement;

    // Random quote on every refresh
    const q = this.quotes[Math.floor(Math.random() * this.quotes.length)];
    authorEl.textContent = q.author;

    // reveal word by word with natural reading pauses
    const words = q.text.split(' ');
    let wordIdx = 0;

    const nextWord = () => {
      if (wordIdx >= words.length) {
        // all words shown — fill bar then show author
        bar.style.transition = 'width 0.6s ease';
        bar.style.width = '100%';
        setTimeout(() => {
          authorEl.classList.add('show');
          setTimeout(() => preloader.classList.add('preloader--hidden'), 2000);
        }, 700);
        return;
      }
      const word = words[wordIdx];
      quoteEl.textContent = words.slice(0, wordIdx + 1).join(' ');
      // fill bar proportionally
      bar.style.transition = 'width 0.25s linear';
      bar.style.width = `${((wordIdx + 1) / words.length) * 90}%`;
      wordIdx++;

      // pause logic: longer at sentence/clause breaks
      let delay = 220;
      if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) delay = 900;
      else if (word.endsWith(',') || word.endsWith(';') || word.endsWith(':')) delay = 500;

      setTimeout(nextWord, delay);
    };

    nextWord();
  }
}
