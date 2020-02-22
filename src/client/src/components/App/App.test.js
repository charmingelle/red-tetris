import React from 'react';
import { App } from './App';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { EMPTY_STORE, ROOM } from '../../mocks';

const mockStore = configureStore([]);

test('App rendering Lobby', () => {
  const store = mockStore(EMPTY_STORE);

  expect(
    renderer
      .create(
        <Provider store={store}>
          <App />
        </Provider>,
      )
      .toJSON(),
  ).toMatchSnapshot();
});

test('App rendering Room', () => {
  const store = mockStore({
    socket: null,
    myId: 'id-0',
    myName: 'Anna',
    myRoom: ROOM,
    people: {},
    rooms: {},
    tetro: null,
  });

  expect(
    renderer
      .create(
        <Provider store={store}>
          <App />
        </Provider>,
      )
      .toJSON(),
  ).toMatchSnapshot();
});
