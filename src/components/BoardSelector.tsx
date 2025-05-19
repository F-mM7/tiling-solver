import React from "react";
import Input from "./Input";
import EditableGrid from "./EditableGrid";

interface BoardSelectorProps {
  rows: number;
  cols: number;
  setRows: (n: number) => void;
  setCols: (n: number) => void;
  cellSize: number;
  board: number[][];
  handleBoardChange: (cells: number[][]) => void;
}

const BoardSelector: React.FC<BoardSelectorProps> = ({
  rows,
  cols,
  setRows,
  setCols,
  cellSize,
  board,
  handleBoardChange,
}) => (
  <div>
    <h1>board selector</h1>
    <div>
      <Input label="Rows" value={rows} setValue={setRows} />
      <Input label="Cols" value={cols} setValue={setCols} />
    </div>
    <EditableGrid
      handleChange={handleBoardChange}
      cellSize={cellSize}
      rows={rows}
      cols={cols}
      selectedCells={board}
      color="white"
    />
  </div>
);

export default BoardSelector;
