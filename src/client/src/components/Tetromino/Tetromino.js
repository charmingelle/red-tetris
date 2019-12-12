import React from "react";
import { Square } from "../Square";
import { connect } from "react-redux";

export const TetrominoInner = ({ coords, color }) => (
  <>
    {coords.map(({ row, col }) => (
      <Square left={col} top={row} color={color} key={`${row}+${col}`} />
    ))}
  </>
);

const mapStateToProps = ({
  game: {
    tetromino: { coords, color }
  }
}) => ({ coords, color });

const mapDispatchToProps = null;

export const Tetromino = connect(
  mapStateToProps,
  mapDispatchToProps
)(TetrominoInner);
