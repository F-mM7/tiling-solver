import React, { useState, useEffect, useRef } from "react";
import Cell from "./Cell";

interface GridProps {
  cellSize: number;
  rows: number;
  cols: number;
  color?: string;
  handleGridChange?: (cells: number[][]) => void;
}

const Grid: React.FC<GridProps> = ({
  cellSize,
  rows,
  cols,
  color = "white",
  handleGridChange = () => {},
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState<[number, number]>([-1, -1]);
  const [isStartCellSelected, setStartCellSelected] = useState(false);
  const [selectedCells, setSelectedCells] = useState<number[][]>([]);
  const [currentSelection, setCurrentSelection] = useState<number[][]>([]);

  useEffect(() => {
    handleGridChange(selectedCells);
  }, [selectedCells, handleGridChange]);

  useEffect(() => {
    setSelectedCells((prev) =>
      prev.filter(([r, c]) => r >= 0 && r < rows && c >= 0 && c < cols)
    );
  }, [rows, cols]);

  const colorMap = Array.from({ length: rows }, () => Array(cols).fill("gray"));
  selectedCells.forEach(([r, c]) => {
    if (r < rows && c < cols) colorMap[r][c] = color;
  });

  currentSelection.forEach(([r, c]) => {
    if (r < rows && c < cols)
      colorMap[r][c] = isStartCellSelected ? "gray" : color;
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsSelecting(true);

    const rect = ref.current!.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const row = Math.floor((offsetY / rect.height) * rows);
    const col = Math.floor((offsetX / rect.width) * cols);

    setStartCell([row, col]);
    setStartCellSelected(
      selectedCells.some(([r, c]) => r === row && c === col)
    );
    setCurrentSelection([[row, col]]);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsSelecting(true);

    const rect = ref.current!.getBoundingClientRect();
    const touch = e.touches[0];
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;

    const row = Math.floor((offsetY / rect.height) * rows);
    const col = Math.floor((offsetX / rect.width) * cols);

    setStartCell([row, col]);
    setStartCellSelected(
      selectedCells.some(([r, c]) => r === row && c === col)
    );
    setCurrentSelection([[row, col]]);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!isSelecting) return;

      const rect = ref.current.getBoundingClientRect();
      const row = Math.floor(((e.clientY - rect.top) / rect.height) * rows);
      const col = Math.floor(((e.clientX - rect.left) / rect.width) * cols);
      const [startRow, startCol] = startCell;
      const newSelection: number[][] = [];
      for (let r = Math.min(startRow, row); r <= Math.max(startRow, row); r++) {
        for (
          let c = Math.min(startCol, col);
          c <= Math.max(startCol, col);
          c++
        ) {
          if (r >= 0 && r < rows && c >= 0 && c < cols) {
            newSelection.push([r, c]);
          }
        }
      }
      setCurrentSelection(newSelection);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!ref.current) return;
      if (!isSelecting) return;

      const rect = ref.current.getBoundingClientRect();
      const touch = e.touches[0];
      const row = Math.floor(((touch.clientY - rect.top) / rect.height) * rows);
      const col = Math.floor(((touch.clientX - rect.left) / rect.width) * cols);
      const [startRow, startCol] = startCell;
      const newSelection: number[][] = [];
      for (let r = Math.min(startRow, row); r <= Math.max(startRow, row); r++) {
        for (
          let c = Math.min(startCol, col);
          c <= Math.max(startCol, col);
          c++
        ) {
          if (r >= 0 && r < rows && c >= 0 && c < cols) {
            newSelection.push([r, c]);
          }
        }
      }
      setCurrentSelection(newSelection);
    };

    const handleGlobalMouseUp = () => {
      if (!ref.current) return;
      if (!isSelecting) return;

      setSelectedCells((prev) => {
        if (isStartCellSelected) {
          return prev.filter(
            ([r, c]) =>
              !currentSelection.some(([nr, nc]) => nr === r && nc === c)
          );
        } else {
          const cellSet = new Set(prev.map(([r, c]) => `${r},${c}`));
          currentSelection.forEach(([r, c]) => cellSet.add(`${r},${c}`));
          return Array.from(cellSet)
            .map((key) => key.split(",").map(Number) as [number, number])
            .filter(([r, c]) => r >= 0 && r < rows && c >= 0 && c < cols);
        }
      });

      setIsSelecting(false);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, [
    isSelecting,
    startCell,
    rows,
    cols,
    selectedCells,
    isStartCellSelected,
    currentSelection,
  ]);

  return (
    <div
      ref={ref}
      style={{
        height: cellSize * rows,
        width: cellSize * cols,
        display: "grid",
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        cursor: "pointer",
        userSelect: "none",
        MozUserSelect: "none",
        WebkitUserSelect: "none",
        msUserSelect: "none",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {colorMap.map((row) =>
        row.map((cellColor) => <Cell color={cellColor} />)
      )}
    </div>
  );
};

export default Grid;
