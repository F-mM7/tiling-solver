import React, { useEffect, useState } from "react";
import Grid from "./Grid";

interface SelectorProps {
  handleSelectorChange: (selectedCells: number[][]) => void;
  color?: string;
}

const wrapperHeight = 320;
const wrapperWidth = 320;

const Selector: React.FC<SelectorProps> = ({
  handleSelectorChange: handleSelectorChange,
  color = "white",
}) => {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [selectedCells, setSelectedCells] = useState<number[][]>([]);

  useEffect(() => {
    handleSelectorChange(selectedCells);
  }, [selectedCells, handleSelectorChange]);

  const handleGridChange = (cells: number[][]) => {
    setSelectedCells(cells);
  };

  const cellSize = Math.min(wrapperHeight / rows, wrapperWidth / cols);

  return (
    <div style={{ display: "inline-block", margin: "20px" }}>
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <label>
          Rows:
          <input
            type="number"
            value={rows}
            onChange={(e) => {
              const newRows = Math.min(
                99,
                Math.max(1, parseInt(e.target.value) || 1)
              );
              setRows(newRows);
            }}
            style={{ width: "50px", marginLeft: "5px", marginRight: "10px" }}
          />
        </label>
        <label>
          Columns:
          <input
            type="number"
            value={cols}
            onChange={(e) => {
              const newCols = Math.min(
                99,
                Math.max(1, parseInt(e.target.value) || 1)
              );
              setCols(newCols);
            }}
            style={{ width: "50px", marginLeft: "5px" }}
          />
        </label>
      </div>
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
