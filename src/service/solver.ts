import type { Constraint } from "dancing-links";
import * as dlx from "dancing-links";
import type { BinaryNumber } from "dancing-links/built/typings/lib/interfaces";

interface Orientation {
  coordinates: number[][];
  rotate: number;
}

interface Arrange {
  vector: BinaryNumber[];
  rotate: number;
  shift: number[];
}

export interface PieceArrangeData {
  idx: number;
  rotateNum: number;
  shiftCoordinate: number[];
}

export const normalize = (coordinates: number[][]) => {
  coordinates.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const minRow = Math.min(...coordinates.map(([r]) => r));
  const minCol = Math.min(...coordinates.map(([, c]) => c));
  return coordinates.map(([r, c]) => [r - minRow, c - minCol]);
};

export const shift = (coordinates: number[][], shift: number[]) => {
  const [r0, c0] = coordinates[0];
  return coordinates.map(([r, c]) => [r - r0 + shift[0], c - c0 + shift[1]]);
};

export const rotate = (coordinates: number[][], n: number) => {
  const cos = [1, 0, -1, 0];
  const sin = [0, 1, 0, -1];
  return normalize(
    coordinates.map(([r, c]) => [
      r * cos[n] - c * sin[n],
      r * sin[n] + c * cos[n],
    ])
  );
};

const regalOrientations = (piece: number[][], rotatable: boolean) => {
  const orientations: Orientation[] = [];
  const added = new Set<string>();
  for (let i = 0; i < (rotatable ? 4 : 1); i++) {
    const coordinates = rotate(piece, i);
    if (added.has(coordinates.toString())) break;
    added.add(coordinates.toString());
    orientations.push({ coordinates, rotate: i });
  }
  return orientations;
};

const allArranges = (
  board: number[][],
  piece: number[][],
  rotatable = false
) => {
  board = normalize(board);
  const arranges: Arrange[] = [];

  regalOrientations(piece, rotatable).forEach((orientation) => {
    const coordinates = orientation.coordinates;
    const rotate = orientation.rotate;
    board.forEach(([br, bc]) => {
      const shiftedPiece = shift(coordinates, [br, bc]);
      const indexes = shiftedPiece.map(([r, c]) =>
        board.findIndex(([br, bc]) => {
          return r === br && c === bc;
        })
      );
      if (!indexes.includes(-1)) {
        const dlxRow: BinaryNumber[] = Array(board.length).fill(0);
        indexes.forEach((index) => {
          dlxRow[index] = 1;
        });
        arranges.push({ vector: dlxRow, rotate, shift: [br, bc] });
      }
    });
  });

  return arranges;
};

export const solver = (
  board: number[][],
  pieces: number[][][],
  rotatable: boolean
) => {
  const constraints: Constraint[] = [];

  pieces.forEach((piece, piece_idx) => {
    allArranges(board, piece, rotatable).forEach((arrange) => {
      const idx_vector: BinaryNumber[] = Array(pieces.length).fill(0);
      idx_vector[piece_idx] = 1;
      const constraint: Constraint = {
        data: {
          idx: piece_idx,
          rotateNum: arrange.rotate,
          shiftCoordinate: arrange.shift,
        } as PieceArrangeData,
        primaryRow: arrange.vector,
        secondaryRow: idx_vector,
      };
      constraints.push(constraint);
    });
  });

  return dlx.findAll(constraints);
};
