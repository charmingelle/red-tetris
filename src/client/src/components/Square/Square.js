import React from 'react';
import './Square.css';

export const Square = ({ left, top, color, width, borderWidth }) => {
  const { main, lighter, darker } = color;

  return (
    <div
      className="square"
      style={{
        left: `${left * width}px`,
        top: `${top * width}px`,
        width: `${width}px`,
        height: `${width}px`,
        backgroundColor: main,
        borderLeft: `${borderWidth}px solid ${lighter}`,
        borderTop: `${borderWidth}px solid  ${lighter}`,
        borderRight: `${borderWidth}px solid ${darker}`,
        borderBottom: `${borderWidth}px solid ${darker}`,
      }}
    ></div>
  );
};
