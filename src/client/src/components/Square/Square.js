import React from 'react';
import './Square.css';

export const Square = ({ left, top, color, shift }) => {
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
        borderLeft: `5px solid ${lighter}`,
        borderTop: `5px solid  ${lighter}`,
        borderRight: `5px solid ${darker}`,
        borderBottom: `5px solid ${darker}`,
      }}
    ></div>
  );
};
