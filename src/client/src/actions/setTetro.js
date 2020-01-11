import { SET_TETRO } from '../constants';

export const setTetro = tetro => ({
  type: SET_TETRO,
  payload: tetro,
});
