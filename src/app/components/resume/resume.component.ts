import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section__container client__container" id="resume">
      <h2 class="section__header">Experience & <span>Education</span></h2>

      <h3 class="test">Training & Experience</h3>
      <article class="testimonial__card1">
        <div class="resume-card__top">
          <div>
            <a href="https://www.boardinfinity.com/programs/college-courses" target="_blank" rel="noopener noreferrer"><h3>Summer Training Program</h3></a>
            <h3 class="resume-org">Board Infinity <span>DBMS & SQL</span></h3>
          </div>
          <a href="/Resume.pdf" target="_blank" class="download__btn" rel="noopener noreferrer"><i class="ri-download-2-line"></i>Download CV</a>
        </div>
        <h5>Database Management Systems</h5>
        <ul>
          <li>Strong grasp of DBMS evolution, ER diagrams, and normalization.</li>
          <li>Knowledge of B/B+ Tree indexing, ACID, serializability, and concurrency control.</li>
        </ul>
        <h5>SQL Proficiency</h5>
        <ul>
          <li>DDL, DML, DCL, TCL, joins, subqueries, grouping, unions, and case logic.</li>
          <li>Practical MySQL experience with relational and non-relational database concepts.</li>
        </ul>
        <h4>Learnt Tech<span>: MySQL, SQL</span></h4>
      </article>

      <h3 class="test">Education</h3>
      <div class="testimonial__grid">
        <article class="testimonial__card"><h2>B.Tech</h2><p>2022 - Present<br />Lovely Professional University</p><h4>8.12 / 10.00</h4></article>
        <article class="testimonial__card"><h2>Intermediate</h2><p>2020 - 2022<br />DKNP JR College</p><h4>957 / 1000</h4></article>
        <article class="testimonial__card"><h2>Secondary</h2><p>2019 - 2020<br />Sri Siddartha Educational Institutions</p><h4>10.00 / 10.00</h4></article>
      </div>
    </section>

    <section class="section__container" id="certifications">
      <h2 class="section__header">Certifications & <span>Courses</span></h2>
      <div class="cert__grid">
        <article class="cert__card" *ngFor="let cert of certificates">
          <div class="cert__card-logo">{{ cert[0] }}</div>
          <img class="cert__card-img" [src]="cert[1]" [alt]="cert[0] + ' certificate'" />
          <p class="cert__card-desc">{{ cert[2] }}</p>
          <a class="cert__card-link" [href]="cert[3]" target="_blank" rel="noopener noreferrer">View Certificate <i class="ri-arrow-right-line"></i></a>
        </article>
      </div>
    </section>
  `,
})
export class ResumeComponent {
  readonly certificates = [
    ['NPTEL', 'assets/images/12210470_MOOC_DZU2MXFCertificate_page-0001.jpg', 'Cloud computing certificate from Swayam with deeper cloud technology foundations.', 'https://drive.google.com/file/d/1kXMl26U8M9dGRxv2W_9ZGZ5N3DfTL2JC/view?usp=sharing'],
    ['Coursera', 'assets/images/12210470_MOOC_7VK5AUXCertificate_page-0001.jpg', 'Supervised Learning certificate from Coursera covering machine learning fundamentals.', 'https://drive.google.com/file/d/10To75UJpChRRsKQdrSanRagJ7EbPhhMp/view?usp=sharing'],
    ['HackerRank', 'assets/images/python_basic certificate_page-0001.jpg', 'Python certification showing core programming and problem-solving skills.', 'https://www.hackerrank.com/certificates/b18906a3a19c'],
    ['Coursera', 'assets/images/12210470_MOOC_PVXX77WCertificate_page-0001.jpg', 'Tableau course covering dashboard creation and interactive analytics.', 'https://drive.google.com/file/d/1wL3HxfTMfYB-OstuJikaRAdDZVYf3-s3/view?usp=sharing'],
    ['Coursera', 'assets/images/COURSERA_CPP_page-0001.jpg', 'C++ programming course covering OOP, data structures, and algorithms.', 'https://drive.google.com/file/d/1jjIG6ASvM0bo2-P_SIURsjUvIwdd348o/view?usp=sharing'],
  ];
}
