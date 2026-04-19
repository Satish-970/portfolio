import { useEffect, useState, useRef } from 'react';
import logoGif from '../assets/logo.gif';
import headerImg from '../assets/images/IMG_6223.jpg';

const Preloader = ({ onLoaded, customText }) => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [isHiding, setIsHiding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState(0);
  const hasRun = useRef(false);

  const fullText1 = customText?.[0] ?? 'Forging the Future';
  const fullText2 = customText?.[1] ?? 'Code. Innovate. Impact';

  // Animated dots
  useEffect(() => {
    const id = setInterval(() => setDots(d => (d + 1) % 4), 400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const preload = () => {
      [logoGif, headerImg].forEach(src => {
        const img = new Image(); img.src = src;
      });
    };
    preload();

    const run = async () => {
      let t1 = '';
      const total = fullText1.length + fullText2.length;
      for (let i = 0; i < fullText1.length; i++) {
        await new Promise(r => setTimeout(r, 58));
        t1 += fullText1[i]; setText1(t1);
        setProgress(Math.round(((i + 1) / total) * 90));
      }
      let t2 = '';
      for (let i = 0; i < fullText2.length; i++) {
        await new Promise(r => setTimeout(r, 58));
        t2 += fullText2[i]; setText2(t2);
        setProgress(Math.round(((fullText1.length + i + 1) / total) * 90));
      }
      setProgress(100);
      await new Promise(r => setTimeout(r, 700));
      setIsHiding(true);
      setTimeout(onLoaded, 650);
    };
    run();
  }, [fullText1, fullText2, onLoaded]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: '2.5rem',
      opacity: isHiding ? 0 : 1,
      transform: isHiding ? 'scale(1.04)' : 'scale(1)',
      transition: 'opacity 0.65s ease, transform 0.65s cubic-bezier(0.19,1,0.22,1)',
      pointerEvents: isHiding ? 'none' : 'all',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,184,75,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Spinner with logo */}
      <div style={{ position: 'relative', width: 88, height: 88, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* SVG rings */}
        <svg width="88" height="88" style={{ position: 'absolute', inset: 0 }}>
          <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(232,184,75,0.12)" strokeWidth="2"/>
          <circle cx="44" cy="44" r="38" fill="none" stroke="url(#pGrad)" strokeWidth="2"
            strokeDasharray={`${2*Math.PI*38 * progress / 100} ${2*Math.PI*38}`}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '44px 44px', transition: 'stroke-dasharray 0.2s ease' }}
          />
          <defs>
            <linearGradient id="pGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff9500"/>
              <stop offset="100%" stopColor="#f5d16a"/>
            </linearGradient>
          </defs>
        </svg>
        {/* Outer spinning ring */}
        <div style={{
          position: 'absolute', inset: '-6px', borderRadius: '50%',
          border: '1px solid transparent', borderTopColor: 'var(--gold)',
          animation: 'plSpin 1.2s linear infinite',
        }} />
        {/* Logo */}
        <img src={logoGif} alt="SP" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'contain', zIndex: 2 }} />
      </div>

      {/* Text */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,4vw,2.2rem)',
          fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text)',
          minHeight: '1.3em', lineHeight: '1.3',
        }}>
          {text1}
          <span style={{ opacity: 0.35 }}>|</span>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem,3vw,1.7rem)',
          fontWeight: 700, letterSpacing: '-0.02em',
          background: 'var(--gradient)', WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          minHeight: '1.3em', lineHeight: '1.3', marginTop: '0.15rem',
        }}>
          {text2}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: 220, height: 2, background: 'rgba(232,184,75,0.12)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: 'linear-gradient(90deg, #ff9500, #e8b84b, #f5d16a)',
            borderRadius: 2, transition: 'width 0.15s ease',
            boxShadow: '0 0 10px rgba(232,184,75,0.6)',
          }} />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
          {progress}% {'.'.repeat(dots)}
        </div>
      </div>

      <style>{`@keyframes plSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default Preloader;
