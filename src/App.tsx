import "./App.css";
import Selector from "./components/Selector";
import Result from "./components/Result";
import type { Result as DlxResult } from "dancing-links";
import { useState } from "react";
import { solver } from "./service/solver";
import { colorSet } from "./service/colorSet";
//TODO rotatableを設定できるようにする
function App() {
  const [selectors, setSelectors] = useState<number[]>([0]); // GridSelectorのリストを管理
  const [board, setBoard] = useState<number[][]>([]); // 選択されたセルの座標を管理
  const [pieces, setPieces] = useState<Map<number, number[][]>>(new Map()); // 初期値を空のMapに設定
  const [results, setResults] = useState<{
    dlxResults: DlxResult<string>[][];
    piecesSnapshot: Map<number, number[][]>;
  }>({ dlxResults: [], piecesSnapshot: new Map() }); // piecesのスナップショットを含む

  const colors = colorSet(selectors.length); // セレクターの数に応じて色を生成

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

  const solve = () => {
    const piecesArray = Array.from(pieces.values()); // Mapから配列に変換
    const results = solver(board, piecesArray, true);
    console.log(results);
    setResults(
      { dlxResults: results, piecesSnapshot: new Map(pieces) } // piecesのスナップショットを保存
    );
  };

  const addSelector = () => {
    setSelectors((prev) => [...prev, prev.length]);
  };

  const removeSelector = () => {
    setSelectors((prev) => {
      const updatedSelectors = prev.slice(0, -1); // 最後のセレクターを削除
      setPieces((prevPieces) => {
        const newPieces = new Map(prevPieces);
        newPieces.delete(prev.length - 1); // 対応するデータを削除
        return newPieces;
      });
      return updatedSelectors;
    });
  };

  return (
    <>
      <div>
        <h1>board selector</h1>
        <Selector handleSelectorChange={handleBoardSelectorChange}></Selector>
      </div>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h1>pieces selector</h1>
        <button onClick={addSelector} style={{ marginRight: "10px" }}>
          Add Selector
        </button>
        <button onClick={removeSelector} disabled={selectors.length === 0}>
          Rem Selector
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
              color={colors[id]}
            />
          </div>
        ))}
      </div>

      <div>
        <button onClick={solve} style={{ marginRight: "10px" }}>
          solve
        </button>
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
