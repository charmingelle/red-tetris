import React from 'react';
import { Square } from './Square';
import renderer from 'react-test-renderer';
import { SQUARE_WIDTH } from '../../constants';
import { RED } from '../../mocks';

test('Square', () => {
  expect(
    renderer
      .create(
        <Square
          left={3}
          top={4}
          color={RED}
          width={SQUARE_WIDTH}
          borderWidth={SQUARE_WIDTH / 8}
        />,
      )
      .toJSON(),
  ).toMatchSnapshot();
});
