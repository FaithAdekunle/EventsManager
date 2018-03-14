import Helpers from '../src/app/Helpers';

describe('Helper Functions', () => {
  const { expect } = global;

  it('should return first name with a capitalized first letter', () => {
    expect(Helpers.getFirstName('faith adekunle')).equal('Faith');
  });

  it('should return date rearranged', () => {
    expect(Helpers.changeDateFormat('10-03-2018')).equal('2018/03/10');
  });
});
