import { useState, useEffect, useRef } from 'react';
import logoGif from '../assets/logo.gif';
import '../logo_styles.css';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler';

const RevealText = ({ text }) => (
  <div style={{ position:'relative', overflow:'hidden', height:'1.2em', lineHeight:'1.2em' }}>
    <motion.div
      variants={{ hover:{ y:'-50%' }, initial:{ y:'0%' } }}
      transition={{ duration:0.3, ease:[0.33,1,0.68,1] }}
      style={{ display:'flex', flexDirection:'column' }}
    >
      <span>{text}</span>
      <span style={{ background:'var(--gradient)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{text}</span>
    </motion.div>
  </div>
);

const Navbar = ({ onRefresh, onLogoClick, isTourActive, isLoaded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portfolio-theme') || 'dark';
  });
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const visibilityMap = useRef({});

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const sections = document.querySelectorAll('section[id], header[id]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        visibilityMap.current[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
      });
      const [topId] = Object.entries(visibilityMap.current)
        .reduce((best, [id, ratio]) => ratio > best[1] ? [id, ratio] : best, ['', 0]);
      if (topId) setActiveSection(topId);
    }, { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [isLoaded]);

  const navLinks = [
    { id:'home',    label:'Home' },
    { id:'about',   label:'About' },
    { id:'resume',  label:'Resume' },
    { id:'project', label:'Projects' },
    { id:'service', label:'Skills' },
    { id:'blog',    label:'Blog' },
    { id:'contact', label:'Contact', isBtn: true },
  ];

  return (
    <nav className="navbar-futuristic">
      <div className="nav__bar" style={scrolled ? { boxShadow:'0 8px 40px rgba(0,0,0,0.4)', borderColor:'rgba(232,184,75,0.2)' } : {}}>
        <div className="nav__header">
          <div className="nav__logo">
            <a href="#home" className="nav-logo-link" onClick={(e) => {
              if (onLogoClick) { e.preventDefault(); onLogoClick(); }
            }}>
              <img
                src={logoGif}
                alt="Satish Pakalapati"
                title="Satish Pakalapati"
                className={`nav-logo-gif ${isTourActive ? 'nav-logo-rotating' : ''}`}
              />
              {isTourActive && <span className="nav-tour-text">Click to Stop</span>}
            </a>
          </div>
          <div className="nav__menu__btn" id="menu-btn" onClick={() => setIsOpen(!isOpen)}>
            <span><i className={isOpen ? 'ri-close-line' : 'ri-menu-3-line'}></i></span>
          </div>
        </div>

        <ul className={`nav__links ${isOpen ? 'open' : ''}`} id="nav-links">
          {navLinks.map(link => (
            <li key={link.id} className={`link ${link.isBtn ? 'btn' : ''} ${activeSection === link.id ? 'active' : ''}`}>
              <motion.a
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                  if (link.id === 'home' && onRefresh) onRefresh();
                  const el = document.getElementById(link.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  setActiveSection(link.id);
                }}
                className="relative link-item block"
                initial="initial"
                whileHover="hover"
                style={{ overflow: 'visible', paddingBottom: '6px' }}
              >
                <span className="relative z-10 block">
                  <RevealText text={link.label} />
                </span>
                {activeSection === link.id && !link.isBtn && (
                  <span className="active-line" />
                )}
              </motion.a>
            </li>
          ))}
          <li className="theme-toggle">
            <ThemeTogglerButton currentTheme={theme} onThemeChange={setTheme} />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
