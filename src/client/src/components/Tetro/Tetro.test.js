import React from 'react';
import { Tetro } from './Tetro';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { RED } from '../../mocks';

const mockStore = configureStore([]);

test('Tetro fully visible', () => {
  const store = mockStore({
    socket: null,
    myId: null,
    myName: null,
    myRoom: null,
    people: {},
    rooms: {},
    tetro: {
      figure: [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
      ],
      row: 5,
      col: 4,
      color: RED,
    },
  });

  expect(
    renderer
      .create(
        <Provider store={store}>
          <Tetro />
        </Provider>,
      )
      .toJSON(),
  ).toMatchSnapshot();
});

test('Tetro with only bottom visible', () => {
  const store = mockStore({
    socket: null,
    myId: null,
    myName: null,
    myRoom: null,
    people: {},
    rooms: {},
    tetro: {
      figure: [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
      ],
      row: 1,
      col: 4,
      color: RED,
    },
  });

  expect(
    renderer
      .create(
        <Provider store={store}>
          <Tetro />
        </Provider>,
      )
      .toJSON(),
  ).toMatchSnapshot();
});
