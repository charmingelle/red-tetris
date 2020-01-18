import React from 'react';
import './Square.css';

export const Square = ({ left, top, color, shift }) => (
  <div
    className="square"
    style={{
      left: `${left * shift}px`,
      top: `${top * shift}px`,
      width: `${shift}px`,
      height: `${shift}px`,
      backgroundColor: color,
    }}
  ></div>
);
