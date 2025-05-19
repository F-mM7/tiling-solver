import React from "react";
import Grid from "./Grid";
import type { Result as DlxResult } from "dancing-links";
import { colorSet } from "../service/colorSet";
import { rotate, shift, type PieceArrangeData } from "../service/solver";

export interface ResultProps {
  pieces: number[][][];
  result: DlxResult<PieceArrangeData>[];
}

const Result: React.FC<ResultProps> = ({ pieces, result }) => {
  const colors = colorSet(pieces.length);

  const paintList: Map<number[], string> = new Map();
  result.forEach(({ data: { i, rotateNum, shiftBase } }) => {
    const piece = pieces[i];
    if (!piece) return;
    shift(rotate(piece, rotateNum), shiftBase).forEach(([r, c]) => {
      paintList.set([r, c], colors[i]);
    });
  });

  const rows = Math.max(...Array.from(paintList.keys()).map(([r]) => r)) + 1;
  const cols = Math.max(...Array.from(paintList.keys()).map(([, c]) => c)) + 1;
  const colorMap = Array.from({ length: rows }, () => Array(cols).fill("gray"));

  paintList.forEach((color, [r, c]) => {
    colorMap[r][c] = color;
  });

  const cellSize = 256 / Math.max(rows, cols);

  return (
    <div className="grid-wrapper">
      <Grid colorMap={colorMap} rows={rows} cols={cols} cellSize={cellSize} />
    </div>
  );
};

export default Result;
