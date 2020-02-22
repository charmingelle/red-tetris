import React from 'react';
import { EnterNameForm } from './EnterNameForm';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { EMPTY_STORE } from '../../mocks';

const mockStore = configureStore([]);

test('EnterNameForm', () => {
  const store = mockStore(EMPTY_STORE);

  expect(
    renderer
      .create(
        <Provider store={store}>
          <EnterNameForm />
        </Provider>,
      )
      .toJSON(),
  ).toMatchSnapshot();
});
