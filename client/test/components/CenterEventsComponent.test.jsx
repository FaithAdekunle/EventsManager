import React from 'react';
import { mount } from 'enzyme';
import { CenterEventsComponent } from
  '../../src/app/components/Center/CenterEventsComponent.jsx';
import DialApi from '../../src/app/DialApi';
import OtherActions from '../../src/app/actions/OtherActions';
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

  it('should add hover-date class to element', () => {
    expect(Object.values(listItem.instance().classList)
      .includes('hover-date')).toBe(false);
    listItem.simulate('mouseenter');
    expect(Object.values(listItem.instance().classList)
      .includes('hover-date')).toBe(true);
  });

  it('should remove hover-date class from element', () => {
    listItem.simulate('mouseleave');
    expect(Object.values(listItem.instance().classList)
      .includes('hover-date')).toBe(false);
  });

  it('should call method to send request to decline event', () => {
    const declineEvent = wrapper.find('.fa-times');
    declineEvent.simulate('click');
    expect(declineEventSpy).toHaveBeenCalled();
  });

  it(
    'should add signin path to locations array after unauthenticated decline',
    () => {
      const response = { status: 401 };
      instance.onDeclineFail(response);
      expect(locations.includes('/signin')).toBe(true);
    },
  );

  it('should call method to send request to fetch more events', () => {
    const event = {
      target: {
        scrollHeight: 10,
        scrollTop: 5,
        clientHeight: 5,
      },
    };
    instance.onScroll(event);
    expect(instance.offset).toBe(10);
    expect(updateCenterEventsSpy).toHaveBeenCalled();
  });

  it('should call action to set alert state to null after events fetch', () => {
    instance.onLoadSuccessful('event');
    expect(setAlertSpy).toHaveBeenCalledWith(null);
  });

  it('should call action to alert user of poor connection', () => {
    instance.onLoadFail();
    expect(setAlertSpy).toHaveBeenCalledWith(constants.NO_CONNECTION);
  });

  it('should call componentWillUnmount method before unmounting', () => {
    wrapper.unmount();
    expect(componentWilLUnmountSpy).toHaveBeenCalled();
  });
});
