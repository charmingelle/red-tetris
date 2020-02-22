import React from 'react';
import { Room } from './Room';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { ROOM } from '../../mocks';

const mockStore = configureStore([]);

test('Room', () => {
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
          <Room />
        </Provider>,
      )
      .toJSON(),
  ).toMatchSnapshot();
});
