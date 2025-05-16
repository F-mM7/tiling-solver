import React from "react";

interface CellProps {
  color: string;
}

const Cell: React.FC<CellProps> = ({ color }) => {
  return (
    <div
      style={{
        backgroundColor: color,
        margin: 0,
        border: "1px solid black",
      }}
    />
  );
};

export default Cell;
