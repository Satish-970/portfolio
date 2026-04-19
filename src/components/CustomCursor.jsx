import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef    = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot    = dotRef.current;
    if (!cursor || !dot) return;

    let mouseX = -100, mouseY = -100;
    let cursorX = 0, cursorY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.14;
      cursorY += (mouseY - cursorY) * 0.14;
      cursor.style.transform = `translate3d(${cursorX - 16}px, ${cursorY - 16}px, 0)`;
      requestAnimationFrame(animate);
    };

    const enter = () => setIsHovering(true);
    const leave = () => setIsHovering(false);
    const show  = () => { cursor.classList.remove('cursor--hidden'); dot.classList.remove('cursor--hidden'); };
    const hide  = () => { cursor.classList.add('cursor--hidden'); dot.classList.add('cursor--hidden'); };

    const attach = () => {
      document.querySelectorAll('a,button,input,textarea,.clickable').forEach(el => {
        el.addEventListener('mouseenter', enter);
        el.addEventListener('mouseleave', leave);
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseenter', show);
    document.body.addEventListener('mouseleave', hide);
    attach();
    requestAnimationFrame(animate);

    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseenter', show);
      document.body.removeEventListener('mouseleave', hide);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div className={`custom-cursor ${isHovering ? 'cursor--hover' : ''}`} ref={cursorRef}></div>
      <div className={`cursor-dot ${isHovering ? 'cursor--hover' : ''}`} ref={dotRef}></div>
    </>
  );
};

export default CustomCursor;
