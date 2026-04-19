import { useState, useRef, useEffect } from 'react';

const LazyImage = ({ src, alt, className, style }) => {
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: '300px' }
    );
    if (wrapRef.current) obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapRef} style={{ position: 'relative', overflow: 'hidden', width: '100%', ...style }}>
      {/* Shimmer skeleton */}
      {!loaded && !error && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(110deg, rgba(232,184,75,0.04) 25%, rgba(232,184,75,0.10) 50%, rgba(232,184,75,0.04) 75%)',
          backgroundSize: '200% 100%',
          animation: 'liShimmer 1.6s ease-in-out infinite',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            border: '2px solid transparent', borderTopColor: 'rgba(232,184,75,0.5)',
            animation: 'liSpin 1s linear infinite',
          }} />
        </div>
      )}

      {/* Error fallback */}
      {error && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '6px',
          background: 'rgba(232,184,75,0.04)', color: 'var(--text-dim)',
        }}>
          <i className="ri-image-line" style={{ fontSize: '1.5rem' }}></i>
          <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>Image unavailable</span>
        </div>
      )}

      {visible && (
        <img
          src={src}
          alt={alt}
          className={className}
          onLoad={() => setLoaded(true)}
          onError={() => { setError(true); setLoaded(true); }}
          style={{
            display: 'block', width: '100%',
            opacity: loaded && !error ? 1 : 0,
            transition: 'opacity 0.5s ease',
            ...(!className ? { objectFit: 'cover' } : {}),
          }}
        />
      )}
      <style>{`
        @keyframes liShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes liSpin    { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
};

export default LazyImage;
