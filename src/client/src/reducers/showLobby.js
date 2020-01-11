import { CHANGE_SHOW_LOBBY } from '../constants';

const initialState = true;

export const showLobby = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_SHOW_LOBBY: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
