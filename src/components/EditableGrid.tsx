import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Grid from "./Grid";

interface EditableGridProps {
  cellSize: number;
  rows: number;
  cols: number;
  color?: string;
  selectedCells: number[][];
  handleChange: (cells: number[][]) => void;
}

const EditableGrid: React.FC<EditableGridProps> = ({
  cellSize,
  rows,
  cols,
  color = "white",
  selectedCells,
  handleChange: handleChange,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState<[number, number]>([-1, -1]);
  const [isStartCellSelected, setStartCellSelected] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<number[][]>([]);

  const colorMap = useMemo(() => {
    const map = Array.from({ length: rows }, () => Array(cols).fill("gray"));
    selectedCells.forEach(([r, c]) => {
      if (r < rows && c < cols) map[r][c] = color;
    });
    if (isSelecting)
      currentSelection.forEach(([r, c]) => {
        if (r < rows && c < cols)
          map[r][c] = isStartCellSelected ? "gray" : color;
      });
    return map;
  }, [
    rows,
    selectedCells,
    isSelecting,
    currentSelection,
    cols,
    color,
    isStartCellSelected,
  ]);

  const getCellFromEvent = useCallback(
    (e: PointerEvent) => {
      if (!ref.current) return [-1, -1];
      const rect = ref.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      const row = Math.floor((offsetY / rect.height) * rows);
      const col = Math.floor((offsetX / rect.width) * cols);
      return [row, col];
    },
    [rows, cols]
  );

  const handleDown = useCallback(
    (e: React.PointerEvent) => {
      setIsSelecting(true);
      const [row, col] = getCellFromEvent(e.nativeEvent);
      setStartCell([row, col]);
      setStartCellSelected(
        selectedCells.some(([r, c]) => r === row && c === col)
      );
      setCurrentSelection([[row, col]]);
    },
    [getCellFromEvent, selectedCells]
  );

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

      let newSelectedCells: number[][];
      const selectionSet = new Set(
        currentSelection.map(([r, c]) => `${r},${c}`)
      );
      if (isStartCellSelected) {
        newSelectedCells = selectedCells.filter(
          ([r, c]) => !selectionSet.has(`${r},${c}`)
        );
      } else {
        const cellSet = new Set(selectedCells.map(([r, c]) => `${r},${c}`));
        currentSelection.forEach(([r, c]) => cellSet.add(`${r},${c}`));
        newSelectedCells = Array.from(cellSet)
          .map((key) => key.split(",").map(Number) as [number, number])
          .filter(([r, c]) => r >= 0 && r < rows && c >= 0 && c < cols);
      }

      handleChange(newSelectedCells);

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
    handleChange,
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
