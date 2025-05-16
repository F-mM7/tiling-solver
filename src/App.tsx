import "./App.css";
import Result from "./components/Result";
import Input from "./components/Input";
import type { Result as DlxResult } from "dancing-links";
import { useEffect, useState } from "react";
import { solver } from "./service/solver";
import { colorSet } from "./service/colorSet";
import EditableGrid from "./components/EditableGrid";

function App() {
  const [selectors, setSelectors] = useState(5);
  const [board, setBoard] = useState<number[][]>([]);
  const [pieces, setPieces] = useState<Map<number, number[][]>>(new Map());
  const [results, setResults] = useState<{
    dlxResults: DlxResult<string>[][];
    piecesSnapshot: Map<number, number[][]>;
  }>({ dlxResults: [], piecesSnapshot: new Map() });

  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);

  const cellSize = 256 / Math.max(rows, cols);

  const colors = colorSet(selectors);

  const handleBoardChange = (selectedCells: number[][]) => {
    setBoard(selectedCells);
  };

  const handlePieceChange = (id: number, selectedCells: number[][]) => {
    setPieces((prev) => {
      const existingCells = prev.get(id);
      if (
        existingCells &&
        JSON.stringify(existingCells) === JSON.stringify(selectedCells)
      )
        return prev;
      else {
        const newPieces = new Map(prev);
        newPieces.set(id, selectedCells);
        return newPieces;
      }
    });
  };

  const [rotatable, setRotatable] = useState(false);

  const toggleRotatable = () => {
    setRotatable((prev) => !prev);
  };

  const solve = () => {
    const piecesArray = Array.from(pieces.values());
    const results = solver(board, piecesArray, rotatable);
    setResults({ dlxResults: results, piecesSnapshot: new Map(pieces) });
  };

  useEffect(() => {
    if (pieces.size === selectors) return;
    const newPieces = new Map<number, number[][]>();
    for (let i = 0; i < selectors; i++) newPieces.set(i, pieces.get(i) ?? []);
    setPieces(newPieces);
  }, [pieces, selectors]);

  return (
    <>
      <title>Tiling Solver</title>

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
          color="white"
        ></EditableGrid>
      </div>
      <div>
        <h1>pieces selector</h1>
        <Input label="Pieces" value={selectors} setValue={setSelectors} />
        <div>
          {Array.from({ length: selectors }, (_, i) => (
            <EditableGrid
              handleChange={(selectedCells) =>
                handlePieceChange(i, selectedCells)
              }
              rows={rows}
              cols={cols}
              cellSize={cellSize}
              color={colors[i]}
            ></EditableGrid>
          ))}
        </div>
      </div>
      <div>
        <h1>Results</h1>
        <button
          onClick={toggleRotatable}
          style={{
            width: "180px",
            background: rotatable ? "#4caf50" : "",
          }}
        >
          {rotatable ? "Rotation: Enabled" : "Rotation: Disabled"}
        </button>
        <button onClick={solve}>Solve</button>
        <div className="flex">
          {results.dlxResults.map((result) => (
            <div>
              <Result pieces={results.piecesSnapshot} result={result} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
