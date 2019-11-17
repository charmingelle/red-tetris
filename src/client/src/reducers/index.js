import { combineReducers } from "redux";
import { tetromino } from "./tetromino";
import { pile } from "./pile";

export const allReducers = combineReducers({
  tetromino,
  pile
});
