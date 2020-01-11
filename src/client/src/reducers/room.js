import { LOAD_ROOM } from '../constants';

const initialState = null;

export const room = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ROOM: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
