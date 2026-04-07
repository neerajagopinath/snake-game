import { memo } from 'react';

function Food({ position }) {
  return (
    <div
      key={`${position.x}-${position.y}`}
      style={{
        position: 'absolute',
        width: 'var(--cell-size)',
        height: 'var(--cell-size)',
        transform: `translate(calc(${position.x} * var(--cell-size)), calc(${position.y} * var(--cell-size)))`,
        display: 'grid',
        placeItems: 'center',
        pointerEvents: 'none',
      }}
      aria-label="prey"
    >
      <span
        style={{
          width: '62%',
          height: '62%',
          borderRadius: '999px',
          background: 'radial-gradient(circle at 30% 28%, #ffe4c9, #ff9f43 42%, #f15a29 100%)',
          boxShadow: '0 0 12px rgba(255, 147, 55, 0.7)',
          animation: 'foodPulse 1.2s ease-in-out infinite',
          zIndex: 2,
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: '8%',
          borderRadius: '999px',
          background: 'radial-gradient(circle, rgba(255,158,76,0.45) 0%, rgba(255,158,76,0) 70%)',
          filter: 'blur(2px)',
          animation: 'foodGlow 1.4s ease-in-out infinite',
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: '18%',
          width: '18%',
          height: '10%',
          borderRadius: '3px',
          background: '#4f2f1c',
          transform: 'rotate(-22deg)',
          zIndex: 3,
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: '17%',
          right: '20%',
          width: '20%',
          height: '14%',
          borderRadius: '100% 0 100% 0',
          background: '#49c06f',
          transform: 'rotate(24deg)',
          zIndex: 3,
        }}
      />
    </div>
  );
}

export default memo(Food);
