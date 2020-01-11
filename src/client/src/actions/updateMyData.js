import { UPDATE_MY_DATA } from '../constants';

export const updateMyData = myData => ({
  type: UPDATE_MY_DATA,
  payload: myData,
});
