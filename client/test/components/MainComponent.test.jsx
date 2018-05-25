import React from 'react';
import { shallow } from 'enzyme';
import { MainComponent } from
  '../../src/app/components/MainComponent.jsx';

describe('Main component', () => {
  const wrapper = shallow(<MainComponent />);
  let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZnVsbE5hb' +
    'WUiOiJmYWl0aCBhZGVrdW5sZSIsImlzQWRtaW4iOmZhbHNlLCJleHBpcmVzIjoxNTI3NDM2' +
    'Nzk2ODkyLCJpYXQiOjE1MjY4MzE5OTZ9.Igp2aayAtu1YsiVtdL0YmqBU1z59' +
    '-3x8Z5u6nB0w0Kc';
  wrapper.setProps({ token });
  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZnVsbE5hb' +
    'WUiOiJhZG1pbiIsImlzQWRtaW4iOnRydWUsImV4cGlyZXMiOjE1MjY4ODQyNTE4OTQsImlhd' +
    'CI6MTUyNjg0MTA1MX0.i52yz0BHMlltCWaVoEekBE2H8iZopsbma-nJ_wm-Cng';
  wrapper.setProps({ token });
  test('unmount comonent', () => {
    wrapper.unmount();
  });
});
