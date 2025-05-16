import React, { useState, useEffect, useRef, useCallback } from "react";
import GridBody from "./GridBody";

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

  const getCellFromEvent = useCallback(
    (e: MouseEvent | TouchEvent): [number, number] => {
      const rect = ref.current!.getBoundingClientRect();
      let clientX: number, clientY: number;
      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const offsetX = clientX - rect.left;
      const offsetY = clientY - rect.top;
      const row = Math.floor((offsetY / rect.height) * rows);
      const col = Math.floor((offsetX / rect.width) * cols);
      return [row, col];
    },
    [rows, cols]
  );

  const handleDown = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    setIsSelecting(true);
    const [row, col] = getCellFromEvent(
      "nativeEvent" in e ? (e as any).nativeEvent : e
    );
    setStartCell([row, col]);
    setStartCellSelected(
      selectedCells.some(([r, c]) => r === row && c === col)
    );
    setCurrentSelection([[row, col]]);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!ref.current) return;
      if (!isSelecting) return;

      const [row, col] = getCellFromEvent(e);
      const [startRow, startCol] = startCell;
      const newSelection: number[][] = [];
      for (let r = Math.min(startRow, row); r <= Math.max(startRow, row); r++) {
        for (
          let c = Math.min(startCol, col);
          c <= Math.max(startCol, col);
          c++
        ) {
          if (r >= 0 && r < rows && c >= 0 && c < cols)
            newSelection.push([r, c]);
        }
      }
      setCurrentSelection(newSelection);
    };

    const handleUp = () => {
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

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [
    isSelecting,
    startCell,
    rows,
    cols,
    selectedCells,
    isStartCellSelected,
    currentSelection,
    getCellFromEvent,
  ]);

  return (
    <div
      ref={ref}
      onMouseDown={handleDown}
      onTouchStart={handleDown}
      style={{ cursor: "pointer" }}
    >
      <GridBody
        cellSize={cellSize}
        rows={rows}
        cols={cols}
        colorMap={colorMap}
      />
    </div>
  );
};

export default Grid;
