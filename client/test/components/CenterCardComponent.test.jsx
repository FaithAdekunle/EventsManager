import React from 'react';
import { mount } from 'enzyme';
import CenterCardComponent from
  '../../src/app/components/Center/CenterCardComponent.jsx';

describe('center card compionent', () => {
  const center = {
    id: 1,
    name: 'Test Center',
    address: 'Test address',
    capacity: 20,
    description: 'Test description',
    images: ['test image 1'],
    facilities: ['test facility 1'],
  };
  const locations = [];
  const history = {
    push(location) {
      locations.push(location);
    },
  };
  const wrapper = mount(<CenterCardComponent
    center={center}
    history={history}
  />);
  const centerName = wrapper.find('.center-name');

  test('nav to center details page', () => {
    expect(locations.length).toBe(0);
    centerName.simulate('click');
    expect(locations.length).toBe(1);
    expect(locations[0]).toBe('/centers/1');
  });

  test('unmount component', () => {
    wrapper.unmount();
  });
});
