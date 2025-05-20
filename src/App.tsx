import "./App.css";
import Result from "./components/Result";
import type { Result as DlxResult } from "dancing-links";
import { useEffect, useState } from "react";
import { solver, type PieceArrangeData } from "./service/solver";
import { colorSet } from "./service/colorSet";
import BoardSelector from "./components/BoardSelector";
import PiecesSelector from "./components/PiecesSelector";
import PresetButtons from "./components/PresetButtons";

function App() {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [board, setBoard] = useState<number[][]>([]);
  const [pieces, setPieces] = useState<number[][][]>([[], [], [], []]);
  const [rotatable, setRotatable] = useState(false);

  const [results, setResults] = useState<{
    dlxResults: DlxResult<PieceArrangeData>[][];
    piecesSnapshot: number[][][];
  }>({ dlxResults: [], piecesSnapshot: [] });

  useEffect(() => {
    setPieces((prev) =>
      prev.map((piece) =>
        piece.filter(([r, c]) => r >= 0 && r < rows && c >= 0 && c < cols)
      )
    );
  }, [rows, cols]);

  const cellSize = 256 / Math.max(rows, cols);

  const colors = colorSet(pieces.length);

  const handleBoardChange = (selectedCells: number[][]) => {
    setBoard(selectedCells);
  };

  const handlePieceChange = (id: number, selectedCells: number[][]) => {
    setPieces((prev) => {
      const existingCells = prev[id];
      if (
        existingCells &&
        JSON.stringify(existingCells) === JSON.stringify(selectedCells)
      )
        return prev;
      else {
        const newPieces = [...prev];
        newPieces[id] = selectedCells;
        return newPieces;
      }
    });
  };

  const toggleRotatable = () => {
    setRotatable((prev) => !prev);
  };

  const solve = () => {
    const piecesArray = Array.from(pieces.values());
    const results = solver(board, piecesArray, rotatable);
    setResults({ dlxResults: results, piecesSnapshot: pieces });
  };

  return (
    <>
      <PresetButtons
        setRows={setRows}
        setCols={setCols}
        setBoard={setBoard}
        setPieces={setPieces}
        setRotatable={setRotatable}
        setResults={setResults}
      />
      <BoardSelector
        rows={rows}
        cols={cols}
        setRows={setRows}
        setCols={setCols}
        cellSize={cellSize}
        board={board}
        handleBoardChange={handleBoardChange}
      />
      <PiecesSelector
        pieces={pieces}
        setPieces={setPieces}
        rows={rows}
        cols={cols}
        cellSize={cellSize}
        colors={colors}
        handlePieceChange={handlePieceChange}
      />
      <div>
        <h1>Results</h1>
        <div>
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
        </div>
        <div>
          {results.dlxResults.map((result, idx) => (
            <Result key={idx} pieces={results.piecesSnapshot} result={result} />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
