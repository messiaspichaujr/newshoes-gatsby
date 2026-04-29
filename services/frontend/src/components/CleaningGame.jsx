import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import vansClean from '../assets/TenisVansLimpo.png';
import vansDirty from '../assets/TenisVansSujo.png';
import jordanClean from '../assets/TenisJordanLimpo.png';
import jordanDirty from '../assets/TenisJordanSujo.png';
import airmaxClean from '../assets/TenisAirMaxLimpo.png';
import airmaxDirty from '../assets/TenisAirMaxSujo.png';

const SHOES = [
  { id: 'vans', clean: vansClean, dirty: vansDirty, thumb: vansClean, name: 'Vans' },
  { id: 'jordan', clean: jordanClean, dirty: jordanDirty, thumb: jordanClean, name: 'Jordan' },
  { id: 'airmax', clean: airmaxClean, dirty: airmaxDirty, thumb: airmaxClean, name: 'Air Max' },
];

const CleaningGame = () => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const waterCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isCleaning, setIsCleaning] = useState(false);
  const [dirtyImgObj, setDirtyImgObj] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [cursorPos, setCursorPos] = useState(null);
  const [selectedShoe, setSelectedShoe] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const [gameSize, setGameSize] = useState({ width: 800, height: 500 });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      const newWidth = Math.min(800, window.innerWidth - 60);
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
    img.src = SHOES[selectedShoe].dirty;
    img.onload = () => setDirtyImgObj(img);
  }, [selectedShoe]);

  const resetGame = useCallback(() => {
    if (!canvasRef.current || !dirtyImgObj) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = gameSize.width;
    canvas.height = gameSize.height;

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imgAspect = dirtyImgObj.width / dirtyImgObj.height;
    const canvasAspect = canvas.width / canvas.height;
    let dx, dy, dw, dh;
    if (imgAspect > canvasAspect) {
      dw = canvas.width; dh = canvas.width / imgAspect; dx = 0; dy = (canvas.height - dh) / 2;
    } else {
      dh = canvas.height; dw = canvas.height * imgAspect; dx = (canvas.width - dw) / 2; dy = 0;
    }
    ctx.drawImage(dirtyImgObj, dx, dy, dw, dh);
  }, [dirtyImgObj, gameSize]);

  useEffect(() => {
    if (dirtyImgObj && canvasRef.current) resetGame();
  }, [dirtyImgObj, gameSize, resetGame]);

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
        p.wobble += p.wobbleSpeed;

        const displayX = p.x + Math.sin(p.wobble) * 2;
        const alpha = (p.life / p.maxLife) * 0.6;

        const gradient = ctx.createRadialGradient(
          displayX - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.1,
          displayX, p.y, p.size
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.9})`);
        gradient.addColorStop(0.4, `rgba(28, 170, 217, ${alpha * 0.3})`);
        gradient.addColorStop(0.7, `rgba(200, 230, 255, ${alpha * 0.2})`);
        gradient.addColorStop(1, `rgba(28, 170, 217, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(displayX, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        if (p.life <= 0) particles.splice(index, 1);
      });

      if (isCleaning && typeof window !== 'undefined' && window.mousePos) {
        const glow = ctx.createRadialGradient(
          window.mousePos.x, window.mousePos.y, 0,
          window.mousePos.x, window.mousePos.y, 50
        );
        glow.addColorStop(0, 'rgba(28, 170, 217, 0.15)');
        glow.addColorStop(1, 'rgba(28, 170, 217, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(window.mousePos.x, window.mousePos.y, 50, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < 4; i++) {
          const maxLife = 30;
          particles.push({
            x: window.mousePos.x + (Math.random() - 0.5) * 30,
            y: window.mousePos.y,
            speedY: -(Math.random() * 3 + 1),
            speedX: (Math.random() - 0.5) * 2,
            size: Math.random() * 8 + 3,
            life: maxLife,
            maxLife,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.1 + 0.05,
          });
        }
      }

      animationFrameId = window.requestAnimationFrame(render);
    };
    render();
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [isCleaning, gameSize]);

  const handleMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY);
    if (clientX == null || clientY == null) return;

    const localX = clientX - rect.left;
    const localY = clientY - rect.top;
    setCursorPos({ x: localX, y: localY });

    if (typeof window !== 'undefined') {
      window.mousePos = { x: localX, y: localY };
    }

    if (!isCleaning) return;

    const ctx = canvas.getContext('2d');
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = localX * scaleX;
    const y = localY * scaleY;

    ctx.globalCompositeOperation = 'destination-out';
    const brushSize = 40 * (gameSize.width / 800);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize);
    gradient.addColorStop(0, 'rgba(0,0,0,1)');
    gradient.addColorStop(0.5, 'rgba(0,0,0,0.8)');
    gradient.addColorStop(0.8, 'rgba(0,0,0,0.3)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleSelectShoe = (index) => {
    if (index === selectedShoe || transitioning) return;
    setTransitioning(true);
    setIsCleaning(false);
    setCursorPos(null);
    setTimeout(() => {
      setSelectedShoe(index);
      setTransitioning(false);
    }, 250);
  };

  const shoe = SHOES[selectedShoe];

  if (!mounted) {
    return (
      <section style={{ padding: '80px 20px', background: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(24px, 5vw, 42px)', marginBottom: '10px', color: '#000' }}>
          {t('cleaning.title_prefix')} <span style={{ color: '#1CAAD9' }}>{t('cleaning.title_highlight')}</span>
        </h2>
        <p style={{ color: '#666', marginBottom: '40px', fontSize: 'clamp(13px, 2vw, 16px)' }}>
          {t('cleaning.subtitle')}
        </p>
      </section>
    );
  }

  return (
    <section style={{
      padding: 'clamp(60px, 10vw, 120px) 20px',
      background: '#f5f5f5',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(24px, 5vw, 42px)', marginBottom: '10px', color: '#000' }}>
          {t('cleaning.title_prefix')} <span style={{ color: '#1CAAD9' }}>{t('cleaning.title_highlight')}</span>
        </h2>
        <p style={{ color: '#000', marginBottom: 'clamp(30px, 6vw, 60px)', fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: '500' }}>
          {t('cleaning.subtitle')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        role="application"
        aria-label="Cleaning game"
        ref={containerRef}
        style={{
          position: 'relative',
          width: `${gameSize.width}px`,
          height: `${gameSize.height}px`,
          maxWidth: '100%',
          margin: '0 auto',
          borderRadius: '30px',
          overflow: 'hidden',
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 40px 80px rgba(0, 0, 0, 0.12), 0 0 60px rgba(28, 170, 217, 0.05)',
          cursor: 'none',
          touchAction: 'none',
        }}
        onMouseDown={() => setIsCleaning(true)}
        onMouseUp={() => setIsCleaning(false)}
        onMouseLeave={() => { setIsCleaning(false); setCursorPos(null); }}
        onMouseEnter={(e) => { const rect = containerRef.current?.getBoundingClientRect(); if (rect) setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top }); }}
        onMouseMove={handleMove}
        onTouchStart={() => setIsCleaning(true)}
        onTouchEnd={() => setIsCleaning(false)}
        onTouchMove={handleMove}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={shoe.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: transitioning ? 0 : 1 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${shoe.clean})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        </AnimatePresence>

        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 10, width: '100%', height: '100%' }} />
        <canvas ref={waterCanvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 20, pointerEvents: 'none', width: '100%', height: '100%' }} />

        {cursorPos && (
          <div style={{
            position: 'absolute',
            left: cursorPos.x,
            top: cursorPos.y,
            transform: 'translate(-50%, -50%)',
            zIndex: 30,
            pointerEvents: 'none',
            width: isCleaning ? 40 : 28,
            height: isCleaning ? 40 : 28,
            borderRadius: '50%',
            border: `2px solid ${isCleaning ? '#1CAAD9' : 'rgba(0,0,0,0.4)'}`,
            background: isCleaning ? 'rgba(28, 170, 217, 0.15)' : 'rgba(255,255,255,0.6)',
            transition: 'width 0.15s, height 0.15s, border-color 0.15s, background 0.15s',
          }} />
        )}
      </motion.div>

      {/* Thumbnail selector */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginTop: 'clamp(16px, 3vw, 28px)',
      }}>
        {SHOES.map((s, i) => (
          <motion.button
            key={s.id}
            onClick={() => handleSelectShoe(i)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: 'clamp(60px, 12vw, 80px)',
              height: 'clamp(40px, 8vw, 55px)',
              borderRadius: '12px',
              border: i === selectedShoe ? '2px solid #1CAAD9' : '2px solid rgba(0,0,0,0.1)',
              background: '#fff',
              cursor: 'pointer',
              overflow: 'hidden',
              padding: 0,
              position: 'relative',
              boxShadow: i === selectedShoe ? '0 0 15px rgba(28,170,217,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            <img
              src={s.thumb}
              alt={s.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                opacity: i === selectedShoe ? 1 : 0.5,
                transition: 'opacity 0.2s',
              }}
            />
          </motion.button>
        ))}
      </div>

      <motion.button
        onClick={resetGame}
        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(28, 170, 217, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        style={{
          marginTop: 'clamp(20px, 4vw, 40px)',
          padding: '14px 36px',
          background: '#000',
          color: '#fff',
          border: '2px solid #000',
          borderRadius: '50px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: '600',
          fontSize: '13px',
          fontFamily: 'Montserrat, sans-serif',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        }}
      >
        <motion.span whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} style={{ display: 'inline-flex' }}>
          <RefreshCw size={16} />
        </motion.span>
        {t('cleaning.reset_button')}
      </motion.button>
    </section>
  );
};

export default CleaningGame;
