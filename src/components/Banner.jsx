import { useEffect, useRef } from 'react';
import ScrollReveal from 'scrollreveal';

const cards = [
  {
    icon: 'ri-pen-nib-line',
    title: 'Vision in Action',
    desc: 'A relentless imagination drives every decision — igniting exploration, creation, and mastery in every pursuit.'
  },
  {
    icon: 'ri-layout-masonry-line',
    title: 'Build with Purpose',
    desc: 'Forged digital solutions by fusing analytical rigor with creative brilliance — from data to design, built with precision.'
  },
  {
    icon: 'ri-checkbox-line',
    title: 'Quality, Always',
    desc: 'Committed to flawless, dependable builds — every project meticulously tested, refined, and optimized for maximum impact.'
  },
];

const Banner = () => {
  const cardsRef = useRef([]);

  useEffect(() => {
    ScrollReveal({ distance: '40px', duration: 900, easing: 'cubic-bezier(0.19,1,0.22,1)', viewFactor: 0.3 })
      .reveal('.banner__card', { origin: 'bottom', interval: 150 });
  }, []);

  // 3D tilt on each card
  useEffect(() => {
    const handlers = cardsRef.current.map(card => {
      if (!card) return null;
      const onMove = e => {
        const rect = card.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const dy = (e.clientY - rect.top - rect.height / 2) / rect.height;
        card.style.transform = `perspective(600px) rotateY(${dx * 8}deg) rotateX(${-dy * 6}deg) translateY(-6px)`;
        card.style.boxShadow = `${-dx * 12}px ${-dy * 12}px 40px rgba(0,0,0,0.25), 0 0 30px rgba(232,184,75,0.1)`;
      };
      const onLeave = () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      return { card, onMove, onLeave };
    });
    return () => handlers.forEach(h => {
      if (!h) return;
      h.card.removeEventListener('mousemove', h.onMove);
      h.card.removeEventListener('mouseleave', h.onLeave);
    });
  }, []);

  return (
    <section className="section__container banner__container">
      <div className="banner__grid">
        {cards.map((c, i) => (
          <div
            className="banner__card"
            key={i}
            ref={el => cardsRef.current[i] = el}
            style={{ transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
          >
            {/* Top section: icon + text */}
            <div className="banner__card-top">
              <div className="banner__icon"><i className={c.icon}></i></div>
              <div>
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Banner;
