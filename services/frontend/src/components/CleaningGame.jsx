import React, { useRef, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import imgClean from '../assets/TenisVansLimpo.png';
import imgDirty from '../assets/TenisVansSujo.png';

const CleaningGame = () => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const waterCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isCleaning, setIsCleaning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dirtyImgObj, setDirtyImgObj] = useState(null);
  const [mounted, setMounted] = useState(false);

  const [gameSize, setGameSize] = useState({ width: 800, height: 500 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const newWidth = Math.min(800, window.innerWidth - 40);
      const newHeight = newWidth * (500 / 800);
      setGameSize({ width: newWidth, height: newHeight });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const img = new Image();
    img.src = imgDirty;
    img.onload = () => setDirtyImgObj(img);
  }, []);

  useEffect(() => {
    if (dirtyImgObj && canvasRef.current) {
      resetGame();
    }
  }, [dirtyImgObj, gameSize]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const waterCanvas = waterCanvasRef.current;
    if (!waterCanvas) return;
    const ctx = waterCanvas.getContext('2d');

    waterCanvas.width = gameSize.width;
    waterCanvas.height = gameSize.height;

    let animationFrameId;
    let particles = [];

    const render = () => {
      ctx.clearRect(0, 0, waterCanvas.width, waterCanvas.height);

      particles.forEach((p, index) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.life -= 1;
        ctx.fillStyle = `rgba(173, 216, 230, ${p.life / 20})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.life <= 0) particles.splice(index, 1);
      });

      if (isCleaning && typeof window !== 'undefined' && window.mousePos) {
        for (let i = 0; i < 3; i++) {
          particles.push({
            x: window.mousePos.x,
            y: window.mousePos.y,
            speedY: Math.random() * 4 + 2,
            speedX: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            life: 20
          });
        }
      }
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [isCleaning, gameSize]);

  const handleMove = (e) => {
    if (!isCleaning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY);
    if (clientX == null || clientY == null) return;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    if (typeof window !== 'undefined') {
      window.mousePos = { x: clientX - rect.left, y: clientY - rect.top };
    }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 40 * (gameSize.width / 800), 0, Math.PI * 2);
    ctx.fill();

    if (progress < 100) setProgress(prev => prev + 0.3);
  };

  const resetGame = () => {
    if (!canvasRef.current || !dirtyImgObj) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = gameSize.width;
    canvas.height = gameSize.height;

    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(dirtyImgObj, 0, 0, gameSize.width, gameSize.height);

    setProgress(0);
  };

  if (!mounted) {
    return (
      <section style={{ padding: '80px 20px', backgroundColor: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '32px', marginBottom: '10px' }}>
          {t('cleaning.title_prefix')} <span style={{ color: '#1CAAD9' }}>{t('cleaning.title_highlight')}</span>
        </h2>
        <p style={{ color: '#666', marginBottom: '40px' }}>
          {t('cleaning.subtitle')}
        </p>
      </section>
    );
  }

  return (
    <section style={{ padding: '80px 20px', backgroundColor: '#fff', textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '32px', marginBottom: '10px' }}>
        {t('cleaning.title_prefix')} <span style={{ color: '#1CAAD9' }}>{t('cleaning.title_highlight')}</span>
      </h2>
      <p style={{ color: '#666', marginBottom: '40px' }}>
        {t('cleaning.subtitle')}
      </p>

      <div
        role="application"
        aria-label="Cleaning game"
        ref={containerRef}
        style={{
          position: 'relative',
          width: `${gameSize.width}px`,
          height: `${gameSize.height}px`,
          maxWidth: '100%',
          margin: '0 auto',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
          cursor: 'url("https://cdn-icons-png.flaticon.com/32/2954/2954886.png") 16 16, auto',
          touchAction: 'none',
          backgroundColor: '#f0f0f0'
        }}
        onMouseDown={() => setIsCleaning(true)}
        onMouseUp={() => setIsCleaning(false)}
        onMouseLeave={() => setIsCleaning(false)}
        onMouseMove={handleMove}
        onTouchStart={() => setIsCleaning(true)}
        onTouchEnd={() => setIsCleaning(false)}
        onTouchMove={handleMove}
      >
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${imgClean})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }} />

        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 10, width: '100%', height: '100%' }} />
        <canvas ref={waterCanvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 20, pointerEvents: 'none', width: '100%', height: '100%' }} />

        <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.7)', padding: '8px 16px', borderRadius: '30px', color: '#fff', zIndex: 30, fontWeight: 'bold', fontSize: '14px', border: '1px solid rgba(255,255,255,0.2)' }}>
          {Math.min(100, Math.floor(progress))}% {t('cleaning.clean_label')}
        </div>
      </div>

      <button
        onClick={resetGame}
        style={{
          marginTop: '30px',
          padding: '12px 30px',
          background: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          fontWeight: 'bold',
          fontSize: '14px',
          fontFamily: 'Montserrat, sans-serif',
          letterSpacing: '1px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }}
      >
        <RefreshCw size={18} /> {t('cleaning.reset_button')}
      </button>
    </section>
  );
};

export default CleaningGame;
