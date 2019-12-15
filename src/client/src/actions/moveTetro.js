import { MOVE_TETRO } from "../constants";

export const moveTetro = ({ left, top }) => ({
  type: MOVE_TETRO,
  payload: { left, top }
});
