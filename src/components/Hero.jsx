import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import LazyImage from './LazyImage';
import headerImg from '../assets/images/IMG_6223.jpg';

const HeroScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth;
    const h = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, w / h, 0.1, 1000);
    camera.position.z = 28;

    // ── Particle field with depth ──
    const count = 2200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const gold = new THREE.Color('#e8b84b');
    const amber = new THREE.Color('#ff9500');
    const blue = new THREE.Color('#4a6fa5');
    const white = new THREE.Color('#ffffff');

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 90;
      positions[i3 + 1] = (Math.random() - 0.5) * 90;
      positions[i3 + 2] = (Math.random() - 0.5) * 70;
      const r = Math.random();
      const c = r < 0.45 ? gold : r < 0.7 ? amber : r < 0.85 ? blue : white;
      c.toArray(colors, i3);
      sizes[i] = Math.random() * 2.5 + 0.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      size: 0.16, vertexColors: true, transparent: true, opacity: 0.75, sizeAttenuation: true,
    });
    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    // ── Floating geometric rings ──
    const rings = [];
    for (let r = 0; r < 3; r++) {
      const rGeo = new THREE.TorusGeometry(6 + r * 4, 0.04, 8, 80);
      const rMat = new THREE.MeshBasicMaterial({
        color: 0xe8b84b, transparent: true, opacity: 0.06 + r * 0.02,
      });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.rotation.x = Math.PI / 2 + r * 0.3;
      ring.rotation.z = r * 0.5;
      ring.position.set(15, -5, -10);
      scene.add(ring);
      rings.push(ring);
    }

    // ── Subtle grid plane ──
    const gridHelper = new THREE.GridHelper(80, 20, 0xe8b84b, 0xe8b84b);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.025;
    gridHelper.position.y = -20;
    gridHelper.position.z = -15;
    scene.add(gridHelper);

    // ── Floating icosahedron (bottom right) ──
    const icoGeo = new THREE.IcosahedronGeometry(2.5, 0);
    const icoMat = new THREE.MeshBasicMaterial({ color: 0xe8b84b, wireframe: true, transparent: true, opacity: 0.12 });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(18, -8, -5);
    scene.add(ico);

    // Mouse tracking
    let mx = 0, my = 0;
    let targetMx = 0, targetMy = 0;
    const onMouseMove = e => {
      targetMx = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMy = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Touch support
    const onTouch = e => {
      const t = e.touches[0];
      targetMx = (t.clientX / window.innerWidth - 0.5) * 2;
      targetMy = -(t.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('touchmove', onTouch, { passive: true });

    let frame;
    const clock = new THREE.Clock();

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse lerp
      mx += (targetMx - mx) * 0.035;
      my += (targetMy - my) * 0.035;

      particles.rotation.y = t * 0.04 + mx * 0.06;
      particles.rotation.x = my * 0.03;

      camera.position.x += (mx * 3 - camera.position.x) * 0.025;
      camera.position.y += (my * 3 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);

      rings.forEach((ring, i) => {
        ring.rotation.x += 0.003 + i * 0.001;
        ring.rotation.z += 0.002;
        ring.position.y = -5 + Math.sin(t * 0.4 + i) * 1.5;
      });

      ico.rotation.x += 0.006;
      ico.rotation.y += 0.004;
      ico.position.y = -8 + Math.sin(t * 0.6) * 1.2;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = mount.clientWidth, nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />;
};

const NAMES = [
  { text: 'సతీష్',   lang: 'Telugu' },
  { text: 'सतीश',     lang: 'Hindi' },
  { text: 'സതീഷ്',   lang: 'Malayalam' },
  { text: 'சதீஷ்', lang: 'Tamil' },
  { text: 'सतीश',     lang: 'Marathi' },
  { text: 'Satish',  lang: 'English' },
];

const NameCycler = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const isFinal = index === NAMES.length - 1;

  useEffect(() => {
    if (isFinal) return;
    const fade = setTimeout(() => setVisible(false), 900);
    const next = setTimeout(() => { setIndex(i => i + 1); setVisible(true); }, 1100);
    return () => { clearTimeout(fade); clearTimeout(next); };
  }, [index, isFinal]);

  const { text, lang } = NAMES[index];

  return (
    <span className="hero-name-stack" style={{ position: 'relative' }}>
      <span
        className="hero-name-line"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-12px)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          display: 'block',
        }}
      >{text}</span>
      <span className="hero-name-line hero-name-accent" style={{ display: 'block' }}>
        Pakalapati
      </span>
      {!isFinal && (
        <span style={{
          position: 'absolute', bottom: '-1.4rem', left: 0,
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase',
          opacity: visible ? 0.7 : 0, transition: 'opacity 0.2s ease',
        }}>{lang}</span>
      )}
    </span>
  );
};

const Hero = () => {
  const imgRef = useRef(null);

  // Tilt effect on image wrapper
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const onMove = e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      el.style.transform = `perspective(600px) rotateY(${dx * 12}deg) rotateX(${-dy * 10}deg) scale(1.02)`;
    };
    const onLeave = () => { el.style.transform = 'perspective(600px) rotateY(0) rotateX(0) scale(1)'; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, []);

  return (
    <header className="header" id="home">
      <HeroScene />

      {/* Radial gradient overlay for depth */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 70% at 80% 50%, transparent 0%, var(--bg) 100%)',
      }} />

      <div className="header__container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="header__content">
          <div className="header__eyebrow">Crafting Digital Excellence</div>
          <div className="header__title">
            <span className="header__greeting">Hi, I'm</span>
            <NameCycler />
          </div>
          <p className="header__desc">
            A dynamic Data Analyst &amp; Developer — fiercely dedicated to unlocking insights
            through data and driving AI-powered breakthroughs. Fusing razor-sharp analytical
            prowess with cutting-edge development expertise.
          </p>
          <div className="header__actions">
            <a href="mailto:satishpakalapati65@gmail.com" className="btn">Hire Me Now</a>
            <a href="#project" className="btn-outline" onClick={e => { e.preventDefault(); document.getElementById('project')?.scrollIntoView({ behavior:'smooth' }); }}>See My Work</a>
          </div>

        </div>

        <div className="header__image">
          <div className="header__image-wrapper" ref={imgRef}
            style={{ transition: 'transform 0.15s ease' }}>
            {/* Decorative ring */}
            <div style={{
              position: 'absolute', inset: '-12px',
              borderRadius: '40% 60% 60% 40%/40% 40% 60% 60%',
              border: '1px solid rgba(232,184,75,0.2)',
              animation: 'morphBlob 8s ease-in-out infinite',
              zIndex: -1,
            }} />
            <div style={{
              position: 'absolute', inset: '-24px',
              borderRadius: '40% 60% 60% 40%/40% 40% 60% 60%',
              border: '1px solid rgba(232,184,75,0.08)',
              animation: 'morphBlob 10s ease-in-out 1s infinite reverse',
              zIndex: -1,
            }} />
            <LazyImage
              src={headerImg}
              alt="Satish Pakalapati"
              style={{ borderRadius: '38% 62% 58% 42%/38% 38% 62% 62%', objectFit: 'cover', aspectRatio: '1', animation: 'morphBlob 8s ease-in-out infinite', filter: 'contrast(1.06) brightness(1.02)' }}
            />
          </div>
        </div>
      </div>

      <div className="header__socials">
        <a href="mailto:satishpakalapati65@gmail.com" title="Email"><i className="ri-mail-fill"></i></a>
        <a href="https://github.com/Satish-970" title="GitHub" target="_blank" rel="noopener noreferrer"><i className="ri-github-fill"></i></a>
        <a href="https://www.linkedin.com/in/satishpakalapati/" title="LinkedIn" target="_blank" rel="noopener noreferrer"><i className="ri-linkedin-fill"></i></a>
        <a href="https://satishportfolio.blogspot.com/" title="Blog" target="_blank" rel="noopener noreferrer"><i className="ri-article-fill"></i></a>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
        zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        opacity: 0, animation: 'fadeIn 1s ease 2s forwards',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Scroll</span>
        <div style={{
          width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--gold), transparent)',
          animation: 'scrollPulse 2s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes scrollPulse { 0%,100%{opacity:0.3;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.2)} }
      `}</style>
    </header>
  );
};

export default Hero;
