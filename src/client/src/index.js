import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./components/App/App";
import { createStore } from "redux";
import { allReducers } from "./reducers";
import { Provider } from "react-redux";

export const store = createStore(allReducers);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
