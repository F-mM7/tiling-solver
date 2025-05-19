import type { Constraint } from "dancing-links";
import * as dlx from "dancing-links";
import type { BinaryNumber } from "dancing-links/built/typings/lib/interfaces";

interface Orientation {
  coordinates: number[][];
  rotateNum: number;
}

interface Arrange {
  primaryRow: BinaryNumber[];
  rotateNum: number;
  shiftBase: number[];
}

export interface PieceArrangeData {
  i: number;
  rotateNum: number;
  shiftBase: number[];
}

const normalize = (coordinates: number[][]): number[][] => {
  coordinates.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const minRow = Math.min(...coordinates.map(([r]) => r));
  const minCol = Math.min(...coordinates.map(([, c]) => c));
  return coordinates.map(([r, c]) => [r - minRow, c - minCol]);
};

export const shift = (coordinates: number[][], shift: number[]): number[][] => {
  const [r0, c0] = coordinates[0];
  return coordinates.map(([r, c]) => [r - r0 + shift[0], c - c0 + shift[1]]);
};

export const rotate = (
  coordinates: number[][],
  rotateNum: number
): number[][] => {
  const cos = [1, 0, -1, 0];
  const sin = [0, 1, 0, -1];
  return normalize(
    coordinates.map(([r, c]) => [
      r * cos[rotateNum] - c * sin[rotateNum],
      r * sin[rotateNum] + c * cos[rotateNum],
    ])
  );
};

const regalOrientations = (
  piece: number[][],
  rotatable: boolean
): Orientation[] => {
  const orientations: Orientation[] = [];
  const added = new Set<string>();
  for (let rotateNum = 0; rotateNum < (rotatable ? 4 : 1); rotateNum++) {
    const coordinates = rotate(piece, rotateNum);
    const key = coordinates.toString();
    if (added.has(key)) break;
    added.add(key);
    orientations.push({ coordinates, rotateNum });
  }
  return orientations;
};

const allArranges = (
  board: number[][],
  piece: number[][],
  rotatable: boolean
) => {
  board = normalize(board);
  const arranges: Arrange[] = [];

  regalOrientations(piece, rotatable).forEach((orientation) => {
    const coordinates = orientation.coordinates;
    const rotateNum = orientation.rotateNum;
    board.forEach((shiftBase) => {
      const shiftedPiece = shift(coordinates, shiftBase);
      const indexes = shiftedPiece.map(([r, c]) =>
        board.findIndex(([br, bc]) => {
          return r === br && c === bc;
        })
      );
      if (!indexes.includes(-1)) {
        const vector: BinaryNumber[] = Array(board.length).fill(0);
        indexes.forEach((index) => {
          vector[index] = 1;
        });
        arranges.push({
          primaryRow: vector,
          rotateNum,
          shiftBase,
        });
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

  pieces.forEach((piece, i) => {
    allArranges(board, piece, rotatable).forEach(
      ({ rotateNum, shiftBase, primaryRow }) => {
        const secondaryRow: BinaryNumber[] = Array(pieces.length).fill(0);
        secondaryRow[i] = 1;
        const constraint: Constraint = {
          data: {
            i,
            rotateNum,
            shiftBase,
          },
          primaryRow,
          secondaryRow,
        };
        constraints.push(constraint);
      }
    );
  });

  return dlx.findAll(constraints);
};
