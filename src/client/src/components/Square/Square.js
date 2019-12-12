import React from "react";
import "./Square.css";
import { SHIFT } from "../../constants";

export const Square = ({ left, top, color }) => (
  <div
    className="square"
    style={{
      left: `${left * SHIFT}px`,
      top: `${top * SHIFT}px`,
      backgroundColor: color
    }}
  ></div>
);
