function Snake({ segments }) {
  return (
    <>
      {segments.map((segment, index) => (
        <div
          key={`${segment.x}-${segment.y}-${index}`}
          className={`snake-segment ${index === 0 ? 'head' : ''}`}
          style={{
            transform: `translate(calc(${segment.x} * var(--cell-size)), calc(${segment.y} * var(--cell-size)))`,
          }}
        />
      ))}
    </>
  );
}

export default Snake;
