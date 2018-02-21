import React from 'react';
import Home from '../src/app/components/HomeComponent';

describe('<HomeComponent />', () => {
  const { shallow, expect } = global;
  const wrapper = shallow(<Home />, { context: { store: {} } });

  it('renders has a div with classname top-section', () => {
    expect(wrapper.find('div')).to.have.className('top-section');
  });
});

// describe('empty', () => {
//   const { expect } = global;

//   it('should work', () => {
//     expect(true).equal(true);
//   });
// });
