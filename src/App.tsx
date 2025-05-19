import "./App.css";
import Result from "./components/Result";
import Input from "./components/Input";
import type { Result as DlxResult } from "dancing-links";
import { useEffect, useState } from "react";
import { solver, type PieceArrangeData } from "./service/solver";
import { colorSet } from "./service/colorSet";
import EditableGrid from "./components/EditableGrid";

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
      <div>
        <button
          onClick={() => {
            setRows(4);
            setCols(5);
            setBoard([
              [0, 0],
              [0, 1],
              [0, 2],
              [0, 3],
              [0, 4],
              [1, 0],
              [1, 1],
              [1, 2],
              [1, 3],
              [2, 0],
              [2, 2],
              [2, 3],
              [3, 0],
              [3, 1],
              [3, 2],
              [3, 3],
            ]);
            setPieces([
              [
                [1, 2],
                [1, 3],
                [2, 1],
                [2, 2],
              ],
              [
                [0, 1],
                [1, 1],
                [2, 1],
                [2, 2],
              ],
              [
                [1, 1],
                [1, 2],
                [2, 1],
                [2, 2],
              ],
              [
                [1, 1],
                [1, 2],
                [1, 3],
                [2, 2],
              ],
            ]);
            setRotatable(true);
          }}
        >
          Sample
        </button>
        <button
          onClick={() => {
            setRows(4);
            setCols(4);
            setBoard([]);
            setPieces([[], []]);
            setRotatable(false);
            setResults({ dlxResults: [], piecesSnapshot: [] });
          }}
        >
          Clear
        </button>
      </div>
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
          selectedCells={board}
          color="white"
        ></EditableGrid>
      </div>
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
              handleChange={(selectedCells) =>
                handlePieceChange(i, selectedCells)
              }
              rows={rows}
              cols={cols}
              cellSize={cellSize}
              selectedCells={pieces[i]}
              color={colors[i]}
            ></EditableGrid>
          ))}
        </div>
      </div>
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
