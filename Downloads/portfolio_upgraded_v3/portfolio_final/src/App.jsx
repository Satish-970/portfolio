import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Preloader        from './components/Preloader';
import CustomCursor     from './components/CustomCursor';
import ScrollProgress   from './components/ScrollProgress';
import ScrollToTop      from './components/ScrollToTop';
import Navbar           from './components/Navbar';
import Hero             from './components/Hero';
import Banner           from './components/Banner';
import About            from './components/About';
import Resume           from './components/Resume';
import Projects         from './components/Projects';
import Skills           from './components/Skills';
import Blog             from './components/Blog';
import Contact          from './components/Contact';
import Footer           from './components/Footer';
import NotFound         from './components/NotFound';
import LazyLoadSection  from './components/LazyLoadSection';

/* ── Smooth scroll with Lenis ───────────────────────────────── */
import Lenis from 'lenis';

const initLenis = () => {
  const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  return lenis;
};

/* ── Main page ──────────────────────────────────────────────── */
const MainPage = ({ isLoaded }) => (
  <>
    <Hero />
    <LazyLoadSection minHeight="200px"><Banner /></LazyLoadSection>
    <LazyLoadSection minHeight="400px"><About /></LazyLoadSection>
    <LazyLoadSection minHeight="400px"><Resume /></LazyLoadSection>
    <LazyLoadSection minHeight="400px"><Projects /></LazyLoadSection>
    <LazyLoadSection minHeight="400px"><Skills /></LazyLoadSection>
    <LazyLoadSection minHeight="300px"><Blog /></LazyLoadSection>
    <LazyLoadSection minHeight="300px"><Contact /></LazyLoadSection>
    <Footer />
  </>
);

/* ── App shell ──────────────────────────────────────────────── */
export default function App() {
  const [isLoaded, setIsLoaded]       = useState(false);
  const [showSite, setShowSite]       = useState(false);
  const [refreshKey, setRefreshKey]   = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);

  const handleLoaded = useCallback(() => {
    setIsLoaded(true);
    setTimeout(() => setShowSite(true), 100);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  const handleLogoClick = useCallback(() => {
    setIsTourActive(v => !v);
  }, []);

  // Init Lenis smooth scroll after site loads
  useEffect(() => {
    if (!showSite) return;
    const lenis = initLenis();
    return () => lenis.destroy();
  }, [showSite]);

  return (
    <BrowserRouter>
      {/* Preloader — only on the main page route */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              {!isLoaded && <Preloader onLoaded={handleLoaded} />}

              {showSite && (
                <>
                  <CustomCursor />
                  <ScrollProgress />
                  <Navbar
                    onRefresh={handleRefresh}
                    onLogoClick={handleLogoClick}
                    isTourActive={isTourActive}
                    isLoaded={isLoaded}
                  />
                  <main key={refreshKey}>
                    <MainPage isLoaded={isLoaded} />
                  </main>
                  <ScrollToTop />
                </>
              )}
            </>
          }
        />
        <Route
          path="*"
          element={
            <>
              <CustomCursor />
              <NotFound />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
