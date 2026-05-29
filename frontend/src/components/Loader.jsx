import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';

const LOADING_PHRASES = [
  'Reading ticket confirmation details...',
  'Interpreting booking confirmation text...',
  'Drafting airline boarding gates...',
  'Tucking in virtual hotel sheets...',
  'Mapping local transportation coordinates...',
  'Checking hotel pillow fluffiness...',
  'Scanning local sightseeing attractions...',
  'Consulting regional weather forecasts...',
  'Brewing fresh AI coffee for the trip...',
  'Folding structural map creases...',
  'Checking luggage weight thresholds...',
  'Securing window seats...',
];

const Loader = ({ message = 'SmartTrip AI is working...' }) => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prevIndex) => (prevIndex + 1) % LOADING_PHRASES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 7, 16, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '24px',
      color: 'white',
      textAlign: 'center',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '420px',
        padding: '40px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        background: 'var(--bg-card-glass)',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        boxShadow: '0 0 50px rgba(139, 92, 246, 0.2)',
      }}>
        {/* Animated Spin Compass */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
          padding: '18px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)',
        }} className="animate-spin-slow">
          <Compass size={40} color="white" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h3 style={{
            fontSize: '22px',
            background: 'linear-gradient(to right, #ffffff, #d8b4fe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
          }}>
            {message}
          </h3>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            height: '24px',
            fontWeight: 500,
            animation: 'shimmer 1.5s infinite',
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            ✈️ {LOADING_PHRASES[phraseIndex]}
          </p>
        </div>

        <div style={{
          width: '180px',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '2px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: '60px',
            background: 'linear-gradient(90deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
            borderRadius: '2px',
            animation: 'loadingBar 1.5s infinite ease-in-out',
          }} />
        </div>
      </div>

      {/* Loading progress keyframe injected in JS inline */}
      <style>{`
        @keyframes loadingBar {
          0% { left: -60px; }
          100% { left: 180px; }
        }
      `}</style>
    </div>
  );
};

export default Loader;
