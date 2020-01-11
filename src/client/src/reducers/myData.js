import { UPDATE_MY_DATA } from '../constants';

const initialState = {
  id: null,
};

export const myData = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_MY_DATA: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
