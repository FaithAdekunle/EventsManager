import React from 'react';
import { shallow } from 'enzyme';
import { EventsWrapperComponent } from
  '../../src/app/components/Event/EventsWrapperComponent.jsx';

describe('events wrapper component', () => {
  const wrapper = shallow(<EventsWrapperComponent />);
  it('should mount component', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

