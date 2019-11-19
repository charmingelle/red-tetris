import React from "react";
import { connect } from "react-redux";
import { Square } from "../Square";

const InnerPile = props => {
  return (
    <>
      {props.pile.map((row, rowIndex) =>
        row.map((el, colIndex) =>
          el === 1 ? (
            <Square
              left={colIndex}
              top={rowIndex}
              key={`${rowIndex}+${colIndex}`}
            />
          ) : null
        )
      )}
    </>
  );
};

const mapStateToProps = ({ game: { pile } }) => ({ pile });

export const Pile = connect(mapStateToProps)(InnerPile);
