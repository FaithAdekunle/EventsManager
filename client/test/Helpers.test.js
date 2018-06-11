import Helpers from '../src/app/Helpers';

describe('Helpers', () => {
  test('get first name from full name', () => {
    expect(Helpers.getFirstName('faith adekunle')).toBe('Faith');
  });

  test('change date format', () => {
    expect(Helpers.changeDateFormat('2018-05-22')).toBe('22/05/2018');
  });
});
