import React from "react";
import Input from "./Input";
import EditableGrid from "./EditableGrid";

interface PiecesSelectorProps {
  pieces: number[][][];
  setPieces: (p: number[][][]) => void;
  rows: number;
  cols: number;
  cellSize: number;
  colors: string[];
  handlePieceChange: (id: number, cells: number[][]) => void;
}

const PiecesSelector: React.FC<PiecesSelectorProps> = ({
  pieces,
  setPieces,
  rows,
  cols,
  cellSize,
  colors,
  handlePieceChange,
}) => (
  <div>
    <h1>pieces selector</h1>
    <div>
      <Input
        label="Pieces"
        value={pieces.length}
        setValue={(num) => {
          const newPieces = [];
          for (let i = 0; i < num; i++) newPieces[i] = pieces[i] ?? [];
          setPieces(newPieces);
        }}
      />
    </div>
    <div>
      {Array.from({ length: pieces.length }, (_, i) => (
        <EditableGrid
          key={i}
          handleChange={(selectedCells) => handlePieceChange(i, selectedCells)}
          rows={rows}
          cols={cols}
          cellSize={cellSize}
          selectedCells={pieces[i]}
          color={colors[i]}
        />
      ))}
    </div>
  </div>
);

export default PiecesSelector;
