import { Component } from '@angular/core';
import { scrollToSection } from '../../shared/section-navigation';

@Component({
  selector: 'app-scroll-top',
  standalone: true,
  template: `
    <button class="scroll-top" type="button" (click)="scrollToTop()" aria-label="Scroll to top">
      <i class="ri-arrow-up-line"></i>
    </button>
  `,
})
export class ScrollTopComponent {
  scrollToTop(): void {
    scrollToSection('home');
  }
}
