import React, { useEffect, useState } from "react";
import Grid from "./Grid";

interface SelectorProps {
  handleSelectorChange: (selectedCells: number[][]) => void;
  rows: number;
  cols: number;
  color: string;
}

const wrapperHeight = 320;
const wrapperWidth = 320;

const Selector: React.FC<SelectorProps> = ({
  handleSelectorChange: handleSelectorChange,
  rows,
  cols,
  color,
}) => {
  const [selectedCells, setSelectedCells] = useState<number[][]>([]);

  useEffect(() => {
    handleSelectorChange(selectedCells);
  }, [selectedCells, handleSelectorChange]);

  const handleGridChange = (cells: number[][]) => {
    setSelectedCells(cells);
  };

  const cellSize = Math.min(wrapperHeight / rows, wrapperWidth / cols);

  return (
    <div
      style={{ display: "inline-block", margin: "20px", touchAction: "none" }}
    >
      <div
        style={{
          height: wrapperHeight,
          width: wrapperWidth,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid
          rows={rows}
          cols={cols}
          cellSize={cellSize}
          color={color}
          handleGridChange={handleGridChange}
        />
      </div>
    </div>
  );
};

export default Selector;
