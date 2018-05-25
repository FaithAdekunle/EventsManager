import React from 'react';
import { mount } from 'enzyme';
import { CenterEventsComponent } from
  '../../src/app/components/Center/CenterEventsComponent.jsx';
import DialApi from '../../src/app/DialApi';
import OtherActions from '../../src/app/actions/otherActions';
import constants from '../../src/app/constants';

describe('centers component', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZnVsbE5hb' +
  'WUiOiJhZG1pbiIsImlzQWRtaW4iOnRydWUsImV4cGlyZXMiOjE1MjY4ODQyNTE4OTQsImlhd' +
  'CI6MTUyNjg0MTA1MX0.i52yz0BHMlltCWaVoEekBE2H8iZopsbma-nJ_wm-Cng';
  const events = [{
    id: 1,
    centerId: 1,
    isAccepted: true,
    name: 'Test Event',
    type: 'meeting',
    guests: '20',
    start: '22/05/2018',
    end: '22/05/2018',
    center: {
      id: 1,
      name: 'Test event center',
    },
  }];
  const locations = [];
  const history = {
    push(location) {
      locations.push(location);
    },
  };
  const wrapper = mount(<CenterEventsComponent
    events={events}
    token={token}
    history={history}
  />);
  const listItem = wrapper.find('.listItem');
  const instance = wrapper.instance();
  const componentWilLUnmountSpy = jest
    .spyOn(instance, 'componentWillUnmount');
  const declineEventSpy = jest.spyOn(DialApi, 'declineEvent');
  const updateCenterEventsSpy = jest.spyOn(DialApi, 'updateCenterEvents');
  const setAlertSpy = jest.spyOn(OtherActions, 'setAlert');

  test('mouse enter event', () => {
    expect(Object.values(listItem.instance().classList)
      .includes('hover-date')).toBe(false);
    listItem.simulate('mouseenter');
    expect(Object.values(listItem.instance().classList)
      .includes('hover-date')).toBe(true);
  });

  test('mouse leave event', () => {
    listItem.simulate('mouseleave');
    expect(Object.values(listItem.instance().classList)
      .includes('hover-date')).toBe(false);
  });

  test('decline event', () => {
    const declineEvent = wrapper.find('.fa-times');
    declineEvent.simulate('click');
    expect(declineEventSpy).toHaveBeenCalled();
  });

  test('decline event fail', () => {
    const response = { status: 401 };
    instance.onDeclineFail(response);
    expect(locations.includes('/signin')).toBe(true);
  });

  test('load more events', () => {
    const e = {
      target: {
        scrollHeight: 10,
        scrollTop: 5,
        clientHeight: 5,
      },
    };
    instance.onScroll(e);
    expect(instance.offset).toBe(10);
    expect(updateCenterEventsSpy).toHaveBeenCalled();
  });

  test('fetch events successful', () => {
    instance.onLoadSuccessful('event');
    expect(setAlertSpy).toHaveBeenCalled();
  });

  test('fetch events fail', () => {
    instance.onLoadFail();
    expect(setAlertSpy).toHaveBeenCalledWith(constants.NO_CONNECTION);
  });

  test('component unmounts', () => {
    wrapper.unmount();
    expect(componentWilLUnmountSpy).toHaveBeenCalled();
  });
});
