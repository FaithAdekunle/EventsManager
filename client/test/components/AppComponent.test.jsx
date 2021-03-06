import React from 'react';
import { shallow } from 'enzyme';
import AppComponent from
  '../../src/app/components/AppComponent.jsx';

describe('App component', () => {
  const wrapper = shallow(<AppComponent />);
  it('should mount component', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
