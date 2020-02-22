import React from 'react';
import { People } from './People';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

const mockStore = configureStore([]);

test(`Two people, Anna's screen`, () => {
  const store = mockStore({
    socket: null,
    myId: 'id-0',
    myName: null,
    myRoom: null,
    people: {
      'id-0': { name: 'Anna', score: 0 },
      'id-1': { name: 'Olya', score: 3 },
    },
    rooms: {},
    tetro: null,
  });

  expect(
    renderer
      .create(
        <Provider store={store}>
          <People />
        </Provider>,
      )
      .toJSON(),
  ).toMatchSnapshot();
});

test(`Two people, Olya's screen`, () => {
  const store = mockStore({
    socket: null,
    myId: 'id-1',
    myName: null,
    myRoom: null,
    people: {
      'id-0': { name: 'Anna', score: 0 },
      'id-1': { name: 'Olya', score: 3 },
    },
    rooms: {},
    tetro: null,
  });

  expect(
    renderer
      .create(
        <Provider store={store}>
          <People />
        </Provider>,
      )
      .toJSON(),
  ).toMatchSnapshot();
});
