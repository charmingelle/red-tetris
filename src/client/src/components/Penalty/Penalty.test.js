import React from 'react';
import { Penalty } from './Penalty';
import renderer from 'react-test-renderer';
import {
  BOTTOM_LIMIT,
  SQUARE_WIDTH,
  OTHER_SQUARE_WIDTH,
} from '../../constants';

test('No penalty', () => {
  expect(
    renderer
      .create(<Penalty startRow={BOTTOM_LIMIT} squareWidth={SQUARE_WIDTH} />)
      .toJSON(),
  ).toMatchSnapshot();
});

test('One penalty row', () => {
  expect(
    renderer
      .create(
        <Penalty
          startRow={BOTTOM_LIMIT - 1}
          squareWidth={OTHER_SQUARE_WIDTH}
        />,
      )
      .toJSON(),
  ).toMatchSnapshot();
});
