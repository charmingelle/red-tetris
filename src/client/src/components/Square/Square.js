import React from "react";
import "./Square.css";
import { SHIFT } from "../../constants";

export const Square = ({ left, top }) => (
  <div
    className="square"
    style={{
      left: `${left * SHIFT}px`,
      top: `${top * SHIFT}px`
    }}
  ></div>
);
