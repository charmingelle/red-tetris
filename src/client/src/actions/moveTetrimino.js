import { MOVE_TETRIMINO } from "../constants";

export const moveTetrimino = ({ left, top }) => ({
  type: MOVE_TETRIMINO,
  payload: { left, top }
});
