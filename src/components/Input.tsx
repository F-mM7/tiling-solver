import React from "react";

type InputProps = {
  label: string;
  value: number;
  setValue: (v: number) => void;
  min?: number;
  max?: number;
};

const Input: React.FC<InputProps> = ({
  label,
  value,
  setValue,
  min = 1,
  max = 99,
}) => (
  <label>
    {label} : {value}
    <button onClick={() => setValue(Math.min(max, value + 1))}>＋</button>
    <button onClick={() => setValue(Math.max(min, value - 1))}>−</button>
  </label>
);

export default Input;
