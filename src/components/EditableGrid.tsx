import React, { useState, useEffect, useRef, useCallback } from "react";
import Grid from "./Grid";

interface EditableGridProps {
  cellSize: number;
  rows: number;
  cols: number;
  color?: string;
  handleChange: (cells: number[][]) => void;
}

const EditableGrid: React.FC<EditableGridProps> = ({
  cellSize,
  rows,
  cols,
  color = "white",
  handleChange: handleChange,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedCells, setSelectedCells] = useState<number[][]>([]);

  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState<[number, number]>([-1, -1]);
  const [isStartCellSelected, setStartCellSelected] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<number[][]>([]);

  useEffect(() => {
    handleChange(selectedCells);
  }, [selectedCells, handleChange]);

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
    (e: PointerEvent) => {
      const rect = ref.current!.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      const row = Math.floor((offsetY / rect.height) * rows);
      const col = Math.floor((offsetX / rect.width) * cols);
      return [row, col];
    },
    [rows, cols]
  );

  const handleDown = (e: React.PointerEvent) => {
    setIsSelecting(true);
    const [row, col] = getCellFromEvent(e.nativeEvent);
    setStartCell([row, col]);
    setStartCellSelected(
      selectedCells.some(([r, c]) => r === row && c === col)
    );
    setCurrentSelection([[row, col]]);
  };

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
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

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
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
      onPointerDown={handleDown}
      className="grid-wrapper"
      style={{
        cursor: "pointer",
        touchAction: "none",
      }}
    >
      <Grid cellSize={cellSize} rows={rows} cols={cols} colorMap={colorMap} />
    </div>
  );
};

export default EditableGrid;
