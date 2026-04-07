import { memo } from 'react';

function getHeading(current, next) {
  if (!next) return 0;
  const dx = current.x - next.x;
  const dy = current.y - next.y;
  if (dx === 1) return 0;
  if (dx === -1) return 180;
  if (dy === 1) return 90;
  return -90;
}

function Snake({ segments }) {
  return (
    <>
      {segments.map((segment, index) => {
        const isHead = index === 0;
        const isTail = index === segments.length - 1;
        const heading = getHeading(segment, segments[index + 1]);

        const segmentSize = isHead ? 1.06 : isTail ? 0.86 : 0.96;
        const translateX = `calc(${segment.x} * var(--cell-size) + (var(--cell-size) * ${(1 - segmentSize) / 2}))`;
        const translateY = `calc(${segment.y} * var(--cell-size) + (var(--cell-size) * ${(1 - segmentSize) / 2}))`;

        return (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            style={{
              position: 'absolute',
              width: `calc(var(--cell-size) * ${segmentSize})`,
              height: `calc(var(--cell-size) * ${segmentSize})`,
              borderRadius: '999px',
              transform: `translate(${translateX}, ${translateY})`,
              transition: 'transform 175ms cubic-bezier(0.22, 0.61, 0.36, 1)',
              background: isHead
                ? 'radial-gradient(circle at 28% 24%, #d8ffe5, #39db8d 62%, #1f8f5f 100%)'
                : isTail
                  ? 'radial-gradient(circle at 30% 24%, #8ef2b1, #1ea669 66%, #157e50 100%)'
                  : 'radial-gradient(circle at 30% 24%, #9ff6c0, #25ba77 66%, #178b57 100%)',
              boxShadow: isHead
                ? '0 0 15px rgba(77, 255, 161, 0.6)'
                : '0 0 10px rgba(63, 233, 146, 0.38)',
              zIndex: segments.length - index,
              filter: 'saturate(1.07)',
            }}
          >
            {isHead ? (
              <>
                <span
                  style={{
                    position: 'absolute',
                    width: '22%',
                    height: '22%',
                    borderRadius: '999px',
                    background: '#05140d',
                    top: '24%',
                    left: '19%',
                    transform: `rotate(${heading}deg) translateX(5%)`,
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    width: '22%',
                    height: '22%',
                    borderRadius: '999px',
                    background: '#05140d',
                    top: '24%',
                    right: '19%',
                    transform: `rotate(${heading}deg) translateX(-5%)`,
                  }}
                />
              </>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

export default memo(Snake);