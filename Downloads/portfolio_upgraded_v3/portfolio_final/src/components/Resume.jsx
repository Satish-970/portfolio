import { useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import cert1 from '../assets/images/12210470_MOOC_DZU2MXFCertificate_page-0001.jpg';
import cert2 from '../assets/images/12210470_MOOC_7VK5AUXCertificate_page-0001.jpg';
import cert3 from '../assets/images/python_basic certificate_page-0001.jpg';
import cert4 from '../assets/images/12210470_MOOC_PVXX77WCertificate_page-0001.jpg';
import cert5 from '../assets/images/COURSERA_CPP_page-0001.jpg';

const Resume = () => {
  useEffect(() => {
    const sr = ScrollReveal({ distance: '30px', duration: 900, easing: 'cubic-bezier(0.19,1,0.22,1)', viewFactor: 0.15 });
    sr.reveal('.testimonial__card1', { origin: 'bottom', delay: 100 });
    sr.reveal('.testimonial__card', { origin: 'bottom', interval: 100 });
  }, []);

  return (
    <>
    <section className="section__container client__container" id="resume">
      <div id="resume-trigger" style={{ position:'absolute', top:'50%', visibility:'hidden' }}></div>

      <h2 className="section__header">Experience &amp; <span>Education</span></h2>

      <div style={{ marginTop:'3rem' }}>
        <h3 className="test">Training & Experience</h3>
        <div className="testimonial__card1">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
            <div>
              <a href="https://www.boardinfinity.com/programs/college-courses" target="_blank" rel="noopener noreferrer">
                <h3>Summer Training Program</h3>
              </a>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginTop:'0.3rem' }}>
                <h3 style={{ fontSize:'1rem', fontWeight:500, color:'var(--text-muted)' }}>Board Infinity</h3>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.7rem', color:'var(--gold)', background:'rgba(232,184,75,0.1)', border:'1px solid var(--border)', padding:'2px 10px', borderRadius:'100px' }}>DBMS & SQL</span>
              </div>
            </div>
            <div className="about__btns">
              <a href="/Resume.pdf" target="_blank" className="download__btn" rel="noopener noreferrer">
                <i className="ri-download-2-line"></i> Download CV
              </a>
            </div>
          </div>

          <div style={{ marginTop:'1.5rem' }}>
            <h5>Database Management Systems (DBMS)</h5>
            <ul>
              <li>Strong grasp of DBMS evolution and core types.</li>
              <li>Skilled in ER diagram creation and normalization (1NF–3NF).</li>
              <li>Proficient in B/B+ Tree indexing for query optimization.</li>
              <li>In-depth knowledge of transaction management: ACID, serializability, concurrency control.</li>
            </ul>
            <h5>SQL Proficiency</h5>
            <ul>
              <li>Mastery of DDL, DML, DCL, TCL.</li>
              <li>Advanced querying: WHERE, ORDER BY, regex, string/boolean/grouping functions.</li>
              <li>Expert in joins, subqueries, GROUP BY, HAVING, UNION, CASE, multi-table queries.</li>
            </ul>
            <h5>Relational &amp; Non-Relational Databases</h5>
            <ul>
              <li>Proficient in MySQL; clear distinction between SQL and NoSQL systems.</li>
            </ul>
          </div>
          <h4>Learnt Tech<span>: MySQL, SQL</span></h4>
        </div>

        <h3 className="test">Education</h3>
        <div className="testimonial__grid">
          <div className="testimonial__card">
            <h2>B.Tech</h2>
            <p>2022 – Present<br />Lovely Professional University</p>
            <h4>8.12 / 10.00</h4>
          </div>
          <div className="testimonial__card">
            <h2>Intermediate</h2>
            <p>2020 – 2022<br />DKNP JR College</p>
            <h4>957 / 1000</h4>
          </div>
          <div className="testimonial__card">
            <h2>Secondary</h2>
            <p>2019 – 2020<br />Sri Siddartha Educational Institutions</p>
            <h4>10.00 / 10.00</h4>
          </div>
        </div>
      </div>
    </section>

    <section className="section__container" id="certifications" style={{ paddingTop:'2rem' }}>
      <h2 className="section__header">Certifications &amp; <span>Courses</span></h2>
      <div className="cert__grid" style={{ marginTop:'2.5rem' }}>
          <div className="cert__card">
            <div className="cert__card-logo">NPTEL</div>
            <img className="cert__card-img" src={cert1} alt="Cloud Computing Certificate" />
            <p className="cert__card-desc">Earned a prestigious cloud computing certificate from Swayam, an initiative by the Indian Government, unlocking deep expertise in cloud computing technologies.</p>
            <a className="cert__card-link" href="https://drive.google.com/file/d/1kXMl26U8M9dGRxv2W_9ZGZ5N3DfTL2JC/view?usp=sharing" target="_blank" rel="noopener noreferrer">
              View Certificate <i className="ri-arrow-right-line"></i>
            </a>
          </div>
          <div className="cert__card">
            <div className="cert__card-logo">Coursera</div>
            <img className="cert__card-img" src={cert2} alt="Supervised Learning Certificate" />
            <p className="cert__card-desc">Earned a Supervised Learning certificate through Coursera, a globally recognized online learning platform offering courses from Stanford University and top institutions.</p>
            <a className="cert__card-link" href="https://drive.google.com/file/d/10To75UJpChRRsKQdrSanRagJ7EbPhhMp/view?usp=sharing" target="_blank" rel="noopener noreferrer">
              View Certificate <i className="ri-arrow-right-line"></i>
            </a>
          </div>
          <div className="cert__card">
            <div className="cert__card-logo">HackerRank</div>
            <img className="cert__card-img" src={cert3} alt="Python Certificate" />
            <p className="cert__card-desc">Achieved a Python certification from HackerRank, demonstrating proficiency in core programming concepts and problem-solving skills.</p>
            <a className="cert__card-link" href="https://www.hackerrank.com/certificates/b18906a3a19c" target="_blank" rel="noopener noreferrer">
              View Certificate <i className="ri-arrow-right-line"></i>
            </a>
          </div>
          <div className="cert__card">
            <div className="cert__card-logo">Coursera</div>
            <img className="cert__card-img" src={cert4} alt="Tableau Certificate" />
            <p className="cert__card-desc">Completed a Tableau course on Coursera, gaining hands-on experience in data visualization, dashboard creation, and interactive analytics.</p>
            <a className="cert__card-link" href="https://drive.google.com/file/d/1wL3HxfTMfYB-OstuJikaRAdDZVYf3-s3/view?usp=sharing" target="_blank" rel="noopener noreferrer">
              View Certificate <i className="ri-arrow-right-line"></i>
            </a>
          </div>
          <div className="cert__card">
            <div className="cert__card-logo">Coursera</div>
            <img className="cert__card-img" src={cert5} alt="C++ Certificate" />
            <p className="cert__card-desc">Completed a C++ programming course on Coursera covering object-oriented principles, data structures, and algorithmic problem-solving.</p>
            <a className="cert__card-link" href="https://drive.google.com/file/d/1jjIG6ASvM0bo2-P_SIURsjUvIwdd348o/view?usp=sharing" target="_blank" rel="noopener noreferrer">
              View Certificate <i className="ri-arrow-right-line"></i>
            </a>
          </div>
        </div>
    </section>
    </>
  );
};

export default Resume;
