import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  const [dirtyImgObj, setDirtyImgObj] = useState(null);
  const [mounted, setMounted] = useState(false);

  const [gameSize, setGameSize] = useState({ width: 800, height: 500 });

  useEffect(() => {
    setMounted(true);
  }, []);

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
            wobbleSpeed: Math.random() * 0.1 + 0.05
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
    const brushSize = 40 * (gameSize.width / 800);
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const resetGame = () => {
    if (!canvasRef.current || !dirtyImgObj) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = gameSize.width;
    canvas.height = gameSize.height;

    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(dirtyImgObj, 0, 0, gameSize.width, gameSize.height);
  };

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
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: '500px', height: '500px', background: '#1CAAD9', filter: 'blur(180px)', opacity: 0.06, borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '400px', height: '400px', background: '#1CAAD9', filter: 'blur(150px)', opacity: 0.04, borderRadius: '50%', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(24px, 5vw, 42px)', marginBottom: '10px', color: '#000' }}>
          {t('cleaning.title_prefix')} <span style={{ color: '#1CAAD9' }}>{t('cleaning.title_highlight')}</span>
        </h2>
        <p style={{ color: '#666', marginBottom: 'clamp(30px, 6vw, 60px)', fontSize: 'clamp(13px, 2vw, 16px)' }}>
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
          background: 'rgba(0, 0, 0, 0.02)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 40px 80px rgba(0, 0, 0, 0.12), 0 0 60px rgba(28, 170, 217, 0.05)',
          cursor: isCleaning ? 'none' : 'url("https://cdn-icons-png.flaticon.com/32/2954/2954886.png") 16 16, auto',
          touchAction: 'none'
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
      </motion.div>

      <motion.button
        onClick={resetGame}
        whileHover={{
          scale: 1.05,
          boxShadow: '0 0 30px rgba(28, 170, 217, 0.4)'
        }}
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
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
        }}
      >
        <motion.span
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'inline-flex' }}
        >
          <RefreshCw size={16} />
        </motion.span>
        {t('cleaning.reset_button')}
      </motion.button>
    </section>
  );
};

export default CleaningGame;
