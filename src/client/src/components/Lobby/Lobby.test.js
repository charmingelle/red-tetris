import React from 'react';
import { Lobby } from './Lobby';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { EMPTY_STORE, PERSON_ANNA, PERSON_OLYA } from '../../mocks';

const mockStore = configureStore([]);

test('Empty lobby', () => {
  const store = mockStore(EMPTY_STORE);

  expect(
    renderer
      .create(
        <Provider store={store}>
          <Lobby />
        </Provider>,
      )
      .toJSON(),
  ).toMatchSnapshot();
});

test('Lobby with one player', () => {
  const store = mockStore({
    socket: null,
    myId: null,
    myName: 'Anna',
    myRoom: null,
    people: { 'id-0': PERSON_ANNA },
    rooms: {},
    tetro: null,
  });

  expect(
    renderer
      .create(
        <Provider store={store}>
          <Lobby />
        </Provider>,
      )
      .toJSON(),
  ).toMatchSnapshot();
});

test('Lobby with two players', () => {
  const store = mockStore({
    socket: null,
    myId: null,
    myName: 'Anna',
    myRoom: null,
    people: {
      'id-0': PERSON_ANNA,
      'id-1': PERSON_OLYA,
    },
    rooms: {},
    tetro: null,
  });

  expect(
    renderer
      .create(
        <Provider store={store}>
          <Lobby />
        </Provider>,
      )
      .toJSON(),
  ).toMatchSnapshot();
});

test('Lobby with two players and one roon ready for joining', () => {
  const store = mockStore({
    socket: null,
    myId: null,
    myName: 'Anna',
    myRoom: null,
    people: {
      'id-0': PERSON_ANNA,
      'id-1': PERSON_OLYA,
    },
    rooms: {
      Room: { id: 'Room', game: null },
    },
    tetro: null,
  });

  expect(
    renderer
      .create(
        <Provider store={store}>
          <Lobby />
        </Provider>,
      )
      .toJSON(),
  ).toMatchSnapshot();
});

test('Lobby with two players and one roon with game on', () => {
  const store = mockStore({
    socket: null,
    myId: null,
    myName: 'Anna',
    myRoom: null,
    people: {
      'id-0': PERSON_ANNA,
      'id-1': PERSON_OLYA,
    },
    rooms: {
      Room: { id: 'Room', game: {} },
    },
    tetro: null,
  });

  expect(
    renderer
      .create(
        <Provider store={store}>
          <Lobby />
        </Provider>,
      )
      .toJSON(),
  ).toMatchSnapshot();
});
