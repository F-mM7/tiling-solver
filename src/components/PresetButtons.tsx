import type { Result as DlxResult } from "dancing-links";
import type { PieceArrangeData } from "../service/solver";
import PresetButton, { type Preset } from "./PresetButton";

export interface PresetButtonsProps {
  setRows: (rows: number) => void;
  setCols: (cols: number) => void;
  setBoard: (board: number[][]) => void;
  setPieces: (pieces: number[][][]) => void;
  setRotatable: (rotatable: boolean) => void;
  setResults: (results: {
    dlxResults: DlxResult<PieceArrangeData>[][];
    piecesSnapshot: number[][][];
  }) => void;
}

const presets: Preset[] = [
  {
    name: "Sample",
    rows: 4,
    cols: 5,
    board: [
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
    ],
    pieces: [
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
    ],
    rotatable: true,
  },
  {
    name: "Clear",
    rows: 4,
    cols: 4,
    board: [],
    pieces: [[], []],
    rotatable: false,
  },
];

const PresetButtons: React.FC<PresetButtonsProps> = ({
  setRows,
  setCols,
  setBoard,
  setPieces,
  setRotatable,
  setResults,
}) => {
  const applyPreset = (preset: Preset) => {
    setRows(preset.rows);
    setCols(preset.cols);
    setBoard(preset.board);
    setPieces(preset.pieces);
    setRotatable(preset.rotatable);
    setResults({ dlxResults: [], piecesSnapshot: [] });
  };

  return (
    <div>
      {presets.map((preset, idx) => (
        <PresetButton key={idx} preset={preset} onClick={applyPreset} />
      ))}
    </div>
  );
};

export default PresetButtons;
