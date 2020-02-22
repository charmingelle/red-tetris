import React from 'react';
import { Others } from './Others';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { RED, LINE, GI, EMPTY_PILE, NOT_EMPTY_PILE } from '../../mocks';

const mockStore = configureStore([]);

test('Others in room with 3 players', () => {
  const store = mockStore({
    socket: null,
    myId: 'id-0',
    myName: 'Anna',
    myRoom: {
      id: 'Room',
      leader: 'id-0',
      players: {
        'id-0': {
          id: 'id-0',
          name: 'Anna',
          pile: NOT_EMPTY_PILE,
          tetro: {
            figure: LINE,
            row: 1,
            col: 4,
            color: RED,
          },
          score: 0,
          isGameOver: false,
        },
        'id-1': {
          id: 'id-1',
          name: 'Olya',
          pile: NOT_EMPTY_PILE,
          tetro: {
            figure: LINE,
            row: 1,
            col: 4,
            color: RED,
          },
          score: 0,
          isGameOver: false,
        },
        'id-2': {
          id: 'id-2',
          name: 'Dasha',
          pile: EMPTY_PILE,
          tetro: {
            figure: GI,
            row: 0,
            col: 4,
            color: RED,
          },
          score: 0,
          isGameOver: false,
        },
      },
    },
    people: {},
    rooms: {},
    tetro: null,
  });

  expect(
    renderer
      .create(
        <Provider store={store}>
          <Others />
        </Provider>,
      )
      .toJSON(),
  ).toMatchSnapshot();
});
