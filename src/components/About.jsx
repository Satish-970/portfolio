import { useEffect, useRef } from 'react';
import ScrollReveal from 'scrollreveal';
import LazyImage from './LazyImage';
import aboutImg from '../assets/images/aboutme.jpeg';

const About = () => {
  const imgRef = useRef(null);

  useEffect(() => {
    const sr = ScrollReveal({ distance: '40px', duration: 900, easing: 'cubic-bezier(0.19,1,0.22,1)', viewFactor: 0.3 });
    sr.reveal('.about__image', { origin: 'left' });
    sr.reveal('.about__content .section__tag', { origin: 'bottom', delay: 200 });
    sr.reveal('.about__content h2', { origin: 'bottom', delay: 300 });
    sr.reveal('.about__content p', { origin: 'bottom', delay: 400 });
    sr.reveal('.about__content h4', { origin: 'bottom', delay: 500 });
    sr.reveal('.about__btns', { origin: 'bottom', delay: 600 });
  }, []);

  // 3D tilt on image
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const onMove = e => {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const dy = (e.clientY - rect.top - rect.height / 2) / rect.height;
      el.style.transform = `perspective(700px) rotateY(${dx * 10}deg) rotateX(${-dy * 8}deg) scale(1.02)`;
    };
    const onLeave = () => { el.style.transform = ''; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, []);

  return (
    <section className="section__container about__container" id="about">
      <div className="about__image">
        <div
          className="about__image-frame"
          ref={imgRef}
          style={{ transition: 'transform 0.15s ease', transformStyle: 'preserve-3d' }}
        >
          <LazyImage
            src={aboutImg}
            alt="Satish Pakalapati"
            style={{ borderRadius: 'var(--radius)', overflow: 'hidden' }}
          />
          {/* Decorative corner accents */}
          <div style={{ position: 'absolute', top: '-8px', left: '-8px', width: '32px', height: '32px', borderTop: '2px solid var(--gold)', borderLeft: '2px solid var(--gold)', borderRadius: '4px 0 0 0', opacity: 0.6 }} />
          <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '32px', height: '32px', borderBottom: '2px solid var(--gold)', borderRight: '2px solid var(--gold)', borderRadius: '0 0 4px 0', opacity: 0.6 }} />
        </div>
      </div>

      <div className="about__content">
        <div className="section__tag">About Me</div>
        <h2 className="section__header">
          Passionate About <span>Data &amp; Innovation</span>
        </h2>
        <p>
          I'm Satish Pakalapati — a relentless B.Tech Computer Science student at Lovely Professional
          University, mastering the art of Data Science and Digital Marketing with unmatched drive.
        </p>
        <h4>
          Fueled by a passion for innovation, I excel at crafting dynamic dashboards and engineering
          cutting-edge machine learning models. Committed to pushing boundaries, continuously honing
          expertise in emerging technologies and delivering high-impact solutions.
        </h4>

        {/* Highlights row */}
        <div style={{ display: 'flex', gap: '1rem', margin: '1.5rem 0', flexWrap: 'wrap' }}>
          {[
            { icon: 'ri-graduation-cap-line', label: 'LPU — B.Tech CSE' },
            { icon: 'ri-bar-chart-2-line', label: 'Data Scientist' },
            { icon: 'ri-code-s-slash-line', label: 'Full Stack Dev' },
          ].map(({ icon, label }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px',
              background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '100px',
              fontSize: '0.78rem', color: 'var(--text-muted)',
            }}>
              <i className={icon} style={{ color: 'var(--gold)' }}></i>
              {label}
            </div>
          ))}
        </div>

        <div className="about__btns">
          <a href="/Resume.pdf" target="_blank" className="download__btn" rel="noopener noreferrer">
            <i className="ri-download-2-line"></i> Access My CV
          </a>
          <a href="mailto:satishpakalapati65@gmail.com" title="Email"><i className="ri-mail-fill"></i></a>
          <a href="https://github.com/Satish-970" target="_blank" rel="noopener noreferrer" title="GitHub"><i className="ri-github-fill"></i></a>
          <a href="https://www.linkedin.com/in/satishpakalapati/" target="_blank" rel="noopener noreferrer" title="LinkedIn"><i className="ri-linkedin-fill"></i></a>
          <a href="https://satishportfolio.blogspot.com/" target="_blank" rel="noopener noreferrer" title="Blog"><i className="ri-article-fill"></i></a>
        </div>
      </div>
    </section>
  );
};

export default About;
