import React from 'react';
import './Square.css';

export const Square = ({ left, top, color, shift, borderWidth }) => {
  const { main, lighter, darker } = color;

  return (
    <div
      className="square"
      style={{
        left: `${left * shift}px`,
        top: `${top * shift}px`,
        width: `${shift}px`,
        height: `${shift}px`,
        backgroundColor: main,
        borderLeft: `${borderWidth}px solid ${lighter}`,
        borderTop: `${borderWidth}px solid  ${lighter}`,
        borderRight: `${borderWidth}px solid ${darker}`,
        borderBottom: `${borderWidth}px solid ${darker}`,
      }}
    ></div>
  );
};
