import React from "react";
import { Square } from "../Square";
import { connect } from "react-redux";

export const TetrominoInner = ({ coords, left, top }) => (
  <>
    {coords.map(({ row, col }) => (
      <Square left={col} top={row} key={`${row}+${col}`} />
    ))}
  </>
);

const mapStateToProps = ({
  game: {
    tetromino: { coords }
  }
}) => ({ coords });

const mapDispatchToProps = null;

export const Tetromino = connect(
  mapStateToProps,
  mapDispatchToProps
)(TetrominoInner);
