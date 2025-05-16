import "./App.css";
import Selector from "./components/Selector";
import Result from "./components/Result";
import type { Result as DlxResult } from "dancing-links";
import { useState } from "react";
import { solver } from "./service/solver";
import { colorSet } from "./service/colorSet";

function App() {
  const [selectors, setSelectors] = useState<number[]>([0, 1]);
  const [board, setBoard] = useState<number[][]>([]);
  const [pieces, setPieces] = useState<Map<number, number[][]>>(new Map());
  const [results, setResults] = useState<{
    dlxResults: DlxResult<string>[][];
    piecesSnapshot: Map<number, number[][]>;
  }>({ dlxResults: [], piecesSnapshot: new Map() });

  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const colors = colorSet(selectors.length);

  const handleBoardSelectorChange = (selectedCells: number[][]) => {
    setBoard(selectedCells);
  };

  const handlePieceSelectorChange = (id: number, selectedCells: number[][]) => {
    setPieces((prev) => {
      const existingCells = prev.get(id);
      if (
        existingCells &&
        JSON.stringify(existingCells) === JSON.stringify(selectedCells)
      ) {
        return prev;
      } else {
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
    console.log(results);
    setResults({ dlxResults: results, piecesSnapshot: new Map(pieces) });
  };

  const addSelector = () => {
    setSelectors((prev) => [...prev, prev.length]);
  };

  const removeSelector = () => {
    setSelectors((prev) => {
      const updatedSelectors = prev.slice(0, -1);
      setPieces((prevPieces) => {
        const newPieces = new Map(prevPieces);
        newPieces.delete(prev.length - 1);
        return newPieces;
      });
      return updatedSelectors;
    });
  };

  return (
    <>
      <title>Tiling Solver</title>
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
      <div>
        <h1>board selector</h1>
        <Selector
          handleSelectorChange={handleBoardSelectorChange}
          rows={rows}
          cols={cols}
          color="white"
        ></Selector>
      </div>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h1>pieces selector</h1>
        <button onClick={addSelector} style={{ marginRight: "10px" }}>
          Add Selector
        </button>
        <button
          onClick={removeSelector}
          disabled={selectors.length === 0}
          style={{ marginRight: "10px" }}
        >
          Rem Selector
        </button>
        <button onClick={toggleRotatable} style={{ marginRight: "10px" }}>
          {rotatable ? "Disable Rotation" : "Enable Rotation"}
        </button>
        <button onClick={solve} style={{ marginRight: "10px" }}>
          Solve
        </button>
      </div>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {selectors.map((id) => (
          <div>
            <div>{id}</div>
            <Selector
              key={id}
              handleSelectorChange={(selectedCells) =>
                handlePieceSelectorChange(id, selectedCells)
              }
              rows={rows}
              cols={cols}
              color={colors[id]}
            />
          </div>
        ))}
      </div>
      <div>
        <h2>Results</h2>
        {results.dlxResults.map((result, index) => (
          <Result key={index} pieces={results.piecesSnapshot} result={result} />
        ))}
      </div>
    </>
  );
}

export default App;
