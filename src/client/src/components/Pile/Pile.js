import React from "react";
import { connect } from "react-redux";
import { Square } from "../Square";

const InnerPile = props => (
  <>
    {props.pile.map((row, rowIndex) =>
      row.map((el, colIndex) =>
        el !== 0 ? (
          <Square
            left={colIndex}
            top={rowIndex}
            color={el}
            key={`${rowIndex}+${colIndex}`}
          />
        ) : null
      )
    )}
  </>
);

const mapStateToProps = ({ game: { pile } }) => ({ pile });

export const Pile = connect(mapStateToProps)(InnerPile);
