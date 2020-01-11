import { LOAD_ROOM } from '../constants';

export const loadRoom = room => ({
  type: LOAD_ROOM,
  payload: room,
});
