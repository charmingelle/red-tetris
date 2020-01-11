import { CHANGE_SHOW_LOBBY } from '../constants';

export const changeShowLobby = showLobby => ({
  type: CHANGE_SHOW_LOBBY,
  payload: showLobby,
});
