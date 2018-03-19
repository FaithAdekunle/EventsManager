import Helpers from '../src/app/Helpers';

describe('Helper Functions', () => {
  const { expect } = global;

  it('should return first name with a capitalized first letter', () => {
    expect(Helpers.getFirstName('faith adekunle')).equal('Faith');
  });

  it('should return date rearranged', () => {
    expect(Helpers.changeDateFormat('10-03-2018')).equal('2018/03/10');
  });

  it('should sort objects by date property', () => {
    const events = [
      {
        start: '01/01/2019',
      },
      {
        start: '01/05/2018',
      },
      {
        start: '10/05/2018',
      },
    ];
    expect(Helpers.sortByDate(events)).eql([
      {
        start: '01/05/2018',
      },
      {
        start: '10/05/2018',
      },
      {
        start: '01/01/2019',
      },
    ]);
  });

  it('should sort objects by name property', () => {
    const centers = [
      {
        name: 'D events center',
      },
      {
        name: 'B events center',
      },
      {
        name: 'A events center',
      },
    ];
    expect(Helpers.sortByName(centers)).eql([
      {
        name: 'A events center',
      },
      {
        name: 'B events center',
      },
      {
        name: 'D events center',
      },
    ]);
  });
});
