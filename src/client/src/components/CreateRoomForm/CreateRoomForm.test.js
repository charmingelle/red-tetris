import React from 'react';
import { CreateRoomForm } from './CreateRoomForm';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { EMPTY_STORE } from '../../mocks';

const mockStore = configureStore([]);

test('CreateRoomForm', () => {
  const store = mockStore(EMPTY_STORE);

  expect(
    renderer
      .create(
        <Provider store={store}>
          <CreateRoomForm />
        </Provider>,
      )
      .toJSON(),
  ).toMatchSnapshot();
});
