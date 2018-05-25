import React from 'react';
import { shallow } from 'enzyme';
import { CentersWrapperComponent } from
  '../../src/app/components/Center/CentersWrapperComponent.jsx';

describe('centers wrapper component', () => {
  const wrapper = shallow(<CentersWrapperComponent />);
  test('unmount comonent', () => {
    wrapper.unmount();
  });
});

