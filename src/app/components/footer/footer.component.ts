import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="section__container footer__container">
        <div class="footer__col">
          <h5>Satish Pakalapati</h5>
          <p>A dedicated Data Analyst with data visualization skills and hands-on experience in Java, Python, SQL, and machine learning.</p>
          <div class="footer__socials">
            <a href="mailto:satishpakalapati65@gmail.com" title="Email"><i class="ri-mail-fill"></i></a>
            <a href="https://github.com/Satish-970" target="_blank" rel="noopener noreferrer" title="GitHub"><i class="ri-github-fill"></i></a>
            <a href="https://www.linkedin.com/in/satishpakalapati/" target="_blank" rel="noopener noreferrer" title="LinkedIn"><i class="ri-linkedin-fill"></i></a>
            <a href="https://x.com/satishpakalap22" target="_blank" rel="noopener noreferrer" title="Twitter/X"><i class="ri-twitter-x-fill"></i></a>
          </div>
        </div>
        <div class="footer__col">
          <div class="footer__links">
            <h4>Quick Links</h4>
            <a href="/home">Home</a>
            <a href="/about">About</a>
            <a href="/project">Projects</a>
            <a href="/service">Skills</a>
          </div>
        </div>
      </div>
      <div class="footer__bar">© {{ currentYear }} Satish Pakalapati - Crafted with focus, data, and design. All rights reserved.</div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
