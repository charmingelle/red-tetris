import { LOAD_ROOMS } from '../constants';

const initialState = [];

export const rooms = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ROOMS: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
