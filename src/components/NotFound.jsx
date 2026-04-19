import { useState, useEffect, useRef, useCallback } from 'react';

const GRID = 3;
const BLANK = GRID * GRID - 1; // tile index 8 = blank

const PUZZLE_IMAGES = [
  'https://picsum.photos/seed/portfolio1/360/360',
  'https://picsum.photos/seed/tech2024/360/360',
  'https://picsum.photos/seed/data3d/360/360',
  'https://picsum.photos/seed/satish99/360/360',
];

// Check if puzzle is solvable (for 3x3 odd grid, inversions must be even)
function isSolvable(arr) {
  let inv = 0;
  for (let i = 0; i < arr.length - 1; i++)
    for (let j = i + 1; j < arr.length; j++)
      if (arr[j] !== BLANK && arr[i] !== BLANK && arr[i] > arr[j]) inv++;
  return inv % 2 === 0;
}

function shuffleSolvable() {
  const arr = Array.from({ length: GRID * GRID }, (_, i) => i);
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  } while (arr.every((v, i) => v === i) || !isSolvable(arr));
  return arr;
}

// Returns indices of tiles adjacent (up/down/left/right) to blank
function getMovable(tiles) {
  const blankIdx = tiles.indexOf(BLANK);
  const row = Math.floor(blankIdx / GRID);
  const col = blankIdx % GRID;
  const movable = [];
  if (row > 0) movable.push(blankIdx - GRID);
  if (row < GRID - 1) movable.push(blankIdx + GRID);
  if (col > 0) movable.push(blankIdx - 1);
  if (col < GRID - 1) movable.push(blankIdx + 1);
  return movable;
}

const FloatingParticles = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.4, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      o: Math.random() * 0.45 + 0.08,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x = (p.x + p.vx + canvas.width) % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,184,75,${p.o})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
};

const NotFound = () => {
  const tileSize = typeof window !== 'undefined' && window.innerWidth < 500 ? 90 : 120;
  const [tiles, setTiles] = useState(() => shuffleSolvable());
  const [imgUrl, setImgUrl] = useState(() => PUZZLE_IMAGES[Math.floor(Math.random() * PUZZLE_IMAGES.length)]);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [solved, setSolved] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [bestTime, setBestTime] = useState(() => {
    try { const s = localStorage.getItem('nf_puzzle_best'); return s ? parseInt(s) : null; } catch { return null; }
  });
  const timerRef = useRef(null);

  useEffect(() => {
    if (started && !solved) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [started, solved]);

  const movable = getMovable(tiles);

  const handleTile = useCallback((idx) => {
    if (solved) return;
    if (!movable.includes(idx)) return; // only adjacent to blank can move
    if (!started) setStarted(true);

    setTiles(prev => {
      const next = [...prev];
      const blankIdx = next.indexOf(BLANK);
      [next[blankIdx], next[idx]] = [next[idx], next[blankIdx]];
      if (next.every((v, i) => v === i)) {
        setSolved(true);
        clearInterval(timerRef.current);
        const isRec = bestTime === null || elapsed < bestTime;
        setIsNewRecord(isRec);
        const newBest = isRec ? elapsed : bestTime;
        setBestTime(newBest);
        try { localStorage.setItem('nf_puzzle_best', String(newBest)); } catch {}
      }
      return next;
    });
    setMoves(m => m + 1);
  }, [movable, solved, started, elapsed, bestTime]);

  const reset = () => {
    const current = imgUrl;
    let next = PUZZLE_IMAGES[Math.floor(Math.random() * PUZZLE_IMAGES.length)];
    while (next === current && PUZZLE_IMAGES.length > 1) next = PUZZLE_IMAGES[Math.floor(Math.random() * PUZZLE_IMAGES.length)];
    setImgUrl(next);
    setImgLoaded(false);
    setTiles(shuffleSolvable());
    setSolved(false); setElapsed(0); setStarted(false);
    setMoves(0); setIsNewRecord(false);
    clearInterval(timerRef.current);
  };

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const boardSize = GRID * tileSize + (GRID - 1) * 3;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '1.5rem', position: 'relative', overflow: 'hidden',
      background: 'var(--bg)',
    }}>
      <FloatingParticles />
      <div style={{
        position: 'fixed', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,184,75,0.07) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', maxWidth: '860px' }}>
        {/* 404 */}
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(5rem,16vw,9rem)', fontWeight: 900,
          lineHeight: 1, letterSpacing: '-0.06em',
          background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          filter: 'drop-shadow(0 0 50px rgba(232,184,75,0.25))',
          marginBottom: '0.3rem',
        }}>404</div>

        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem,3.5vw,1.6rem)', fontWeight: 700,
          color: 'var(--text)', marginBottom: '0.5rem',
        }}>Oops! Page Teleported Away</div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Slide the tiles to restore the image 🧩
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {[
            { icon: '⏱', label: 'Time', value: fmt(elapsed) },
            { icon: '🏆', label: 'Best', value: bestTime !== null ? fmt(bestTime) : '--:--' },
            { icon: '🔀', label: 'Moves', value: moves },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{
              background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px',
              padding: '0.7rem 1.4rem', minWidth: '95px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}>
              <div style={{ fontSize: '0.9rem', marginBottom: '2px' }}>{icon}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold)', marginTop: '2px' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Puzzle + Preview side by side */}
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '1.5rem' }}>

          {/* Preview image */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gold)',
              letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700,
            }}>Preview</div>
            <div style={{
              width: boardSize / 2, height: boardSize / 2,
              borderRadius: '12px', overflow: 'hidden',
              border: '1px solid var(--border)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              background: 'var(--surface)',
            }}>
              <img
                src={imgUrl} alt="puzzle preview"
                onLoad={() => setImgLoaded(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
                crossOrigin="anonymous"
              />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)' }}>
              Click adjacent tiles to slide
            </div>
          </div>

          {/* Puzzle board */}
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID}, ${tileSize}px)`,
              gap: '3px', padding: '6px',
              background: solved ? 'rgba(100,220,100,0.08)' : 'rgba(232,184,75,0.06)',
              border: `1px solid ${solved ? 'rgba(100,220,100,0.3)' : 'var(--border)'}`,
              borderRadius: '18px',
              boxShadow: solved
                ? '0 0 60px rgba(100,220,100,0.25), 0 8px 40px rgba(0,0,0,0.4)'
                : '0 8px 40px rgba(0,0,0,0.4)',
              transition: 'all 0.5s ease',
            }}>
              {tiles.map((tileVal, idx) => {
                const isBlank = tileVal === BLANK;
                const isMovable = movable.includes(idx);
                const col = tileVal % GRID;
                const row = Math.floor(tileVal / GRID);

                return (
                  <div
                    key={idx}
                    onClick={() => handleTile(idx)}
                    style={{
                      width: tileSize, height: tileSize,
                      borderRadius: '10px',
                      cursor: isBlank ? 'default' : isMovable ? 'pointer' : 'not-allowed',
                      position: 'relative',
                      border: isBlank
                        ? 'none'
                        : isMovable
                          ? '2px solid rgba(232,184,75,0.5)'
                          : '2px solid rgba(255,255,255,0.05)',
                      boxShadow: isBlank ? 'none' : isMovable ? '0 0 12px rgba(232,184,75,0.3)' : '0 2px 8px rgba(0,0,0,0.3)',
                      transform: isMovable && !isBlank ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.15s cubic-bezier(0.34,1.56,0.64,1)',
                      backgroundImage: (!isBlank && imgLoaded) ? `url(${imgUrl})` : 'none',
                      backgroundColor: isBlank
                        ? 'rgba(0,0,0,0.4)'
                        : !imgLoaded ? `hsl(${tileVal * 40},40%,20%)` : 'transparent',
                      backgroundSize: `${GRID * tileSize}px ${GRID * tileSize}px`,
                      backgroundPosition: isBlank ? undefined : `-${col * tileSize}px -${row * tileSize}px`,
                      backgroundRepeat: 'no-repeat',
                      userSelect: 'none',
                      overflow: 'hidden',
                    }}
                  >
                    {/* blank tile inner shadow */}
                    {isBlank && (
                      <div style={{
                        position: 'absolute', inset: 0, borderRadius: '8px',
                        background: 'rgba(0,0,0,0.5)',
                        boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.6)',
                      }} />
                    )}
                    {/* number label always visible */}
                    {!isBlank && (
                      <div style={{
                        position: 'absolute', bottom: '4px', right: '6px',
                        fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700,
                        color: 'rgba(255,255,255,0.9)',
                        textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                        lineHeight: 1,
                      }}>{tileVal + 1}</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Solved overlay */}
            {solved && (
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', borderRadius: '18px',
                background: 'rgba(5,8,17,0.88)', backdropFilter: 'blur(8px)',
                animation: 'nfFadeIn 0.4s ease',
              }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem', animation: 'nfBounce 0.6s ease' }}>🏆</div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800,
                  background: 'var(--gradient)', WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>Puzzle Solved!</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
                  {fmt(elapsed)} · {moves} moves
                </div>
                {isNewRecord && (
                  <div style={{
                    marginTop: '0.6rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                    color: 'var(--gold)', background: 'rgba(232,184,75,0.12)', border: '1px solid var(--border)',
                    padding: '4px 14px', borderRadius: '100px',
                  }}>🎉 New Personal Record!</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={reset} className="btn-outline" style={{ padding: '0.65rem 1.6rem', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
            <i className="ri-refresh-line" style={{ marginRight: '6px' }}></i>New Puzzle
          </button>
          <a href="/" className="btn">
            <i className="ri-home-4-line" style={{ marginRight: '6px' }}></i>Go Home
          </a>
        </div>
      </div>

      <style>{`
        @keyframes nfFadeIn { from { opacity:0; transform:scale(0.95) } to { opacity:1; transform:scale(1) } }
        @keyframes nfBounce { 0%,100% { transform:scale(1) } 50% { transform:scale(1.25) } }
      `}</style>
    </div>
  );
};

export default NotFound;
