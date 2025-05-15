import Cell from "./Cell";

interface GridBodyProps {
  cellSize: number;
  colorMap: string[][];
  rows: number;
  cols: number;
}

const GridBody: React.FC<GridBodyProps> = ({
  cellSize,
  rows,
  cols,
  colorMap,
}) => {
  return (
    <div
      style={{
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

export default GridBody;
