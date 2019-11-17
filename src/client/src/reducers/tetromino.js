import { MOVE_TETRIMINO, RIGHT_LIMIT, BOTTOM_LIMIT } from "../constants";

const getLeft = (stateLeft, payloadLeft, width) => {
  const result = stateLeft + payloadLeft;

  return result >= 0 && result + width <= RIGHT_LIMIT ? result : stateLeft;
};

const getTop = (stateTop, payloadTop, height) => {
  const result = stateTop + payloadTop;

  return result >= 0 && result + height <= BOTTOM_LIMIT ? result : stateTop;
};

export const tetromino = (
  state = {
    coords: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 3, col: 0 }
    ],
    left: 0,
    top: 0,
    width: 1,
    height: 4
  },
  action
) => {
  switch (action.type) {
    case MOVE_TETRIMINO: {
      return {
        ...state,
        left: getLeft(state.left, action.payload.left, state.width),
        top: getTop(state.top, action.payload.top, state.height)
      };
    }
    default: {
      return state;
    }
  }
};
