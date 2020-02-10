import { isNameValid } from '../src/client/src/utils';

test('isNameValid', () => {
  expect(isNameValid('_aNNa-123_')).toBe(true);
  expect(isNameValid('')).toBe(false);
  expect(isNameValid('John Doe')).toBe(false);
});
