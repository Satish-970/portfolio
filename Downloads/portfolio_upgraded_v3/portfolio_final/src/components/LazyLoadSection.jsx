import { useEffect, useRef, useState } from 'react';

const LazyLoadSection = ({ children, minHeight = '400px' }) => {
  const [visible, setVisible] = useState(false);
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          setTimeout(() => setAnimated(true), 50);
          obs.disconnect();
        }
      },
      { rootMargin: '600px' }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        minHeight: visible ? undefined : minHeight,
        opacity: animated ? 1 : 0,
        transform: animated ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.7s cubic-bezier(0.19,1,0.22,1), transform 0.7s cubic-bezier(0.19,1,0.22,1)',
      }}
    >
      {children}
    </div>
  );
};

export default LazyLoadSection;
