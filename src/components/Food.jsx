function Food({ position }) {
  return (
    <div
      className="food-prey"
      style={{
        transform: `translate(calc(${position.x} * var(--cell-size)), calc(${position.y} * var(--cell-size)))`,
      }}
    >
      <span className="food-core" />
      <span className="food-glow" />
    </div>
  );
}

export default Food;
