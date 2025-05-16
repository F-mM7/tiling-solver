import "./App.css";
import Selector from "./components/Selector";
import Result from "./components/Result";
import Input from "./components/Input";
import type { Result as DlxResult } from "dancing-links";
import { useEffect, useState } from "react";
import { solver } from "./service/solver";
import { colorSet } from "./service/colorSet";

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
        <div style={{ marginBottom: "10px", textAlign: "center" }}>
          <Input label="Rows" value={rows} setValue={setRows} />
          <Input label="Cols" value={cols} setValue={setCols} />
        </div>
        <Selector
          handleChange={handleBoardChange}
          rows={rows}
          cols={cols}
          color="white"
        ></Selector>
      </div>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h1>pieces selector</h1>
        <Input label="Pieces" value={selectors} setValue={setSelectors} />
      </div>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {Array.from({ length: selectors }, (_, i) => (
          <div key={i}>
            <Selector
              handleChange={(selectedCells) =>
                handlePieceChange(i, selectedCells)
              }
              rows={rows}
              cols={cols}
              color={colors[i]}
            ></Selector>
          </div>
        ))}
      </div>
      <div>
        <h1>Results</h1>
        <button
          onClick={toggleRotatable}
          style={{
            width: "180px",
            marginRight: "10px",
            background: rotatable ? "#4caf50" : "",
          }}
        >
          {rotatable ? "Rotation: Enabled" : "Rotation: Disabled"}
        </button>
        <button onClick={solve}>Solve</button>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {results.dlxResults.map((result, index) => (
            <Result
              key={index}
              pieces={results.piecesSnapshot}
              result={result}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
