import Cell from "./Cell";

interface GridProps {
  cellSize: number;
  colorMap: string[][];
  rows: number;
  cols: number;
}

const Grid: React.FC<GridProps> = ({ cellSize, rows, cols, colorMap }) => {
  return (
    <div
      style={{
        margin: 0,
        height: cellSize * rows,
        width: cellSize * cols,
        display: "grid",
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {colorMap.map((row) =>
        row.map((cellColor) => <Cell color={cellColor} />)
      )}
    </div>
  );
};

export default Grid;
