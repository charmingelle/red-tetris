import React from 'react';
import { Pile } from './Pile';
import renderer from 'react-test-renderer';
import { SQUARE_WIDTH, OTHER_SQUARE_WIDTH } from '../../constants';
import { EMPTY_PILE, NOT_EMPTY_PILE } from '../../mocks';

test('Empty pile', () => {
  expect(
    renderer
      .create(<Pile pile={EMPTY_PILE} squareWidth={SQUARE_WIDTH} />)
      .toJSON(),
  ).toMatchSnapshot();
});

test('Not empty pile', () => {
  expect(
    renderer
      .create(<Pile pile={NOT_EMPTY_PILE} squareWidth={OTHER_SQUARE_WIDTH} />)
      .toJSON(),
  ).toMatchSnapshot();
});
