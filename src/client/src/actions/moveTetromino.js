import { MOVE_TETRIMINO } from "../constants";

export const moveTetromino = ({ left, top }) => ({
  type: MOVE_TETRIMINO,
  payload: { left, top }
});
