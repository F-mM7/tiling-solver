import React, { useEffect, useState } from "react";
import Grid from "./Grid";

interface SelectorProps {
  handleChange: (selectedCells: number[][]) => void;
  rows: number;
  cols: number;
  color: string;
}

const wrapperHeight = 320;
const wrapperWidth = 320;

const Selector: React.FC<SelectorProps> = ({
  handleChange: handleChange,
  rows,
  cols,
  color,
}) => {
  const [selectedCells, setSelectedCells] = useState<number[][]>([]);

  useEffect(() => {
    handleChange(selectedCells);
  }, [selectedCells, handleChange]);

  const handleChangeInner = (cells: number[][]) => {
    setSelectedCells(cells);
  };

  const cellSize = Math.min(wrapperHeight / rows, wrapperWidth / cols);

  return (
    <div
      style={{
        display: "inline-block",
        margin: "20px",
        touchAction: "none",
        height: wrapperHeight,
        width: wrapperWidth,
      }}
    >
      <Grid
        rows={rows}
        cols={cols}
        cellSize={cellSize}
        color={color}
        handleChange={handleChangeInner}
      />
    </div>
  );
};

export default Selector;
