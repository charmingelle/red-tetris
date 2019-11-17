import React from "react";
import "./App.css";
import socketIOClient from "socket.io-client";
import { Tetromino } from "../Tetromino";
import { moveTetrimino } from "../../actions/moveTetrimino";
import { connect } from "react-redux";
import { LEFT, RIGHT, DOWN } from "../../constants";
import { Pile } from "../Pile";

const checkTestRequestResult = () =>
  fetch("/users", { method: "GET", credentials: "include" })
    .then(res => res.json())
    .then(console.log)
    .catch(console.error);

const keyDownHandler = moveTetrimino => ({ key }) => {
  switch (key) {
    case LEFT: {
      moveTetrimino({ left: -1, top: 0 });
      break;
    }
    case RIGHT: {
      moveTetrimino({ left: 1, top: 0 });
      break;
    }
    case DOWN: {
      moveTetrimino({ left: 0, top: 1 });
      break;
    }
    default: {
      return null;
    }
  }
};

export const AppInner = props => {
  const login = "user";

  socketIOClient({
    query: `login=${login}`
  });

  checkTestRequestResult();

  return (
    <div className="app">
      <div
        className="me"
        onKeyDown={keyDownHandler(props.moveTetrimino)}
        tabIndex={0}
      >
        <Tetromino />
        <Pile />
      </div>
      <div className="you"></div>
    </div>
  );
};

const mapDispatchToProps = { moveTetrimino };

export const App = connect(null, mapDispatchToProps)(AppInner);
