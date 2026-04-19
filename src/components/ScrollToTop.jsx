import { useEffect, useState } from 'react';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      className={`scroll-top ${visible ? '' : 'hidden'}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      style={{ zIndex: 9980 }}
    >
      <i className="ri-arrow-up-line"></i>
    </button>
  );
};

export default ScrollToTop;
