import React from "react";
import GridBody from "./GridBody";
import type { Result as DlxResult } from "dancing-links";
import { colorSet } from "../service/colorSet";
import { rotate, shift } from "../service/solver";

export interface ResultProps {
  pieces: Map<number, number[][]>;
  result: DlxResult<string>[];
}

const Result: React.FC<ResultProps> = ({ pieces, result }) => {
  const colors = colorSet(pieces.size);
  console.log(colors);

  const paintList: Map<number[], string> = new Map();
  //TODO dataをJSONにする
  result.forEach(({ data }) => {
    const [idx, rotateNum, shiftCoordinate] = data
      .split("-")
      .map((s) => JSON.parse(s));

    const piece = pieces.get(idx);
    if (!piece) return;

    shift(rotate(piece, rotateNum), shiftCoordinate).forEach(([r, c]) => {
      paintList.set([r, c], colors[idx]);
    });
  });

  console.log(paintList);

  const rows = Math.max(...Array.from(paintList.keys()).map(([r]) => r)) + 1;
  const cols = Math.max(...Array.from(paintList.keys()).map(([, c]) => c)) + 1;
  const colorMap = Array.from({ length: rows }, () => Array(cols).fill("gray"));

  paintList.forEach((color, [r, c]) => {
    colorMap[r][c] = color;
  });

  const cellSize = 320 / Math.max(rows, cols);

  return (
    <div>
      <GridBody
        colorMap={colorMap}
        rows={rows}
        cols={cols}
        cellSize={cellSize}
      />
    </div>
  );
};

export default Result;
