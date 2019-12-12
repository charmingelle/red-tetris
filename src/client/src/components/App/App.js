import React from "react";
import "./App.css";
import socketIOClient from "socket.io-client";
import { Tetromino } from "../Tetromino";
import { moveTetromino } from "../../actions/moveTetromino";
import { dropTetromino } from "../../actions/dropTetromino";
import { rotateTetromino } from "../../actions/rotateTetromino";
import { LEFT, RIGHT, DOWN, UP } from "../../constants";
import { Pile } from "../Pile";
import { store } from "../../index";

const checkTestRequestResult = () =>
  fetch("/users", { method: "GET", credentials: "include" })
    .then(res => res.json())
    .then(console.log)
    .catch(console.error);

const keyDownHandler = ({ key }) => {
  switch (key) {
    case LEFT: {
      store.dispatch(moveTetromino({ left: -1, top: 0 }));
      break;
    }
    case RIGHT: {
      store.dispatch(moveTetromino({ left: 1, top: 0 }));
      break;
    }
    case UP: {
      store.dispatch(rotateTetromino());
      break;
    }
    case DOWN: {
      store.dispatch(dropTetromino());
      break;
    }
    default: {
      return null;
    }
  }
};

window.setInterval(
  () => store.dispatch(moveTetromino({ left: 0, top: 1 })),
  750
);

window.addEventListener("keydown", keyDownHandler);

export const App = () => {
  const login = "user";

  socketIOClient({
    query: `login=${login}`
  });

  checkTestRequestResult();

  return (
    <div className="app">
      <div className="me" tabIndex={0}>
        <Tetromino />
        <Pile />
      </div>
      <div className="you"></div>
    </div>
  );
};
