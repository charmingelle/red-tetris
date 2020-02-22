import {
  UPDATE_MY_ID,
  UPDATE_PEOPLE,
  UPDATE_ROOMS,
  UPDATE_ROOM,
  UPDATE_TETRO,
  MOVE_TETRO,
  DROP_TETRO,
  ROTATE_TETR0,
  MOVE_TETRO_DOWN,
} from '../constants';
import {
  updateMyId,
  updatePeople,
  updateRooms,
  updateRoom,
  updateTetro,
  moveTetro,
  dropTetro,
  rotateTetro,
  moveTetroDown,
} from './index';
import { TETRO, ROOM, PERSON_ANNA } from '../mocks';

test('updateMyId', () =>
  expect(updateMyId('id-0')).toEqual({
    type: UPDATE_MY_ID,
    payload: 'id-0',
  }));

test('updatePeople', () =>
  expect(updatePeople({ 'id-0': PERSON_ANNA })).toEqual({
    type: UPDATE_PEOPLE,
    payload: {
      'id-0': {
        name: 'Anna',
        score: 0,
      },
    },
  }));

test('updateRooms', () =>
  expect(updateRooms({ Room: ROOM })).toEqual({
    type: UPDATE_ROOMS,
    payload: { Room: ROOM },
  }));

test('updateRoom', () =>
  expect(updateRoom(ROOM)).toEqual({
    type: UPDATE_ROOM,
    payload: ROOM,
  }));

test('updateTetro', () =>
  expect(updateTetro(TETRO)).toEqual({
    type: UPDATE_TETRO,
    payload: TETRO,
  }));

test('moveTetro', () =>
  expect(moveTetro({ left: 1, top: 2 })).toEqual({
    type: MOVE_TETRO,
    payload: { left: 1, top: 2 },
  }));

test('dropTetro', () =>
  expect(dropTetro()).toEqual({
    type: DROP_TETRO,
  }));

test('rotateTetro', () =>
  expect(rotateTetro()).toEqual({
    type: ROTATE_TETR0,
  }));

test('moveTetroDown', () =>
  expect(moveTetroDown()).toEqual({
    type: MOVE_TETRO_DOWN,
  }));
