import React from "react";

export interface Preset {
  name: string;
  rows: number;
  cols: number;
  board: number[][];
  pieces: number[][][];
  rotatable: boolean;
}

export type PresetButtonProps = {
  preset: Preset;
  onClick: (preset: Preset) => void;
};

const PresetButton: React.FC<PresetButtonProps> = ({ preset, onClick }) => (
  <button onClick={() => onClick(preset)}>{preset.name}</button>
);

export default PresetButton;
