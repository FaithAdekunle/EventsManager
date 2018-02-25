import Helpers from '../src/app/Helpers';

describe('Helper Functions', () => {
  const { expect } = global;

  it('should return first name with a capitalized first letter', () => {
    expect(Helpers.getFirstName('faith adekunle')).equal('Faith');
  });
});
