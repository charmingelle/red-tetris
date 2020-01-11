import { LOAD_ROOMS } from '../constants';

export const loadRooms = rooms => ({
  type: LOAD_ROOMS,
  payload: rooms,
});
