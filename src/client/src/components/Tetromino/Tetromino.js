import React from "react";
import { Square } from "../Square";
import { connect } from "react-redux";

export const TetrominoInner = ({ coords, left, top }) => (
  <>
    {coords.map(({ row, col }) => (
      <Square left={col + left} top={row + top} key={`${row}+${col}`} />
    ))}
  </>
);

const mapStateToProps = ({ tetromino: { coords, left, top } }) => ({
  coords,
  left,
  top
});

const mapDispatchToProps = null;

export const Tetromino = connect(
  mapStateToProps,
  mapDispatchToProps
)(TetrominoInner);
