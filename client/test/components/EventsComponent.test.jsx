import React from 'react';
import { shallow } from 'enzyme';
import { EventsComponent } from
  '../../src/app/components/Event/EventsComponent.jsx';
import EventActions from '../../src/app/actions/eventActions';
import OtherActions from '../../src/app/actions/otherActions';
import DialApi from '../../src/app/DialApi';
import constants from '../../src/app/constants';

describe('events component', () => {
  const events = [];
  const locations = [];
  const history = {
    push(location) {
      locations.push(location);
    },
  };
  const componentDidMountSpy = jest
    .spyOn(EventsComponent.prototype, 'componentDidMount');
  const componentWillUnmountSpy = jest
    .spyOn(EventsComponent.prototype, 'componentWillUnmount');
  const addToEventsSpy = jest.spyOn(EventActions, 'addToEvents');
  const setAlertSpy = jest.spyOn(OtherActions, 'setAlert');
  const removeTokenSpy = jest.spyOn(OtherActions, 'removeToken');
  const updateEventsSpy = jest.spyOn(DialApi, 'updateEvents');
  const wrapper = shallow(<EventsComponent
    events={events}
    history={history}
  />);
  const instance = wrapper.instance();
  test('component did mount', () => {
    expect(componentDidMountSpy).toHaveBeenCalled();
    expect(setAlertSpy).toHaveBeenCalledWith('loading');
  });

  test('action to add to event is called', () => {
    const data = {
      metaData: { pagination: { totalCount: 5 } },
      events: [],
    };
    instance.onFetchEventsSuccessful(data);
    expect(setAlertSpy).toHaveBeenCalledWith(null);
    expect(instance.totalCount).toBe(5);
    expect(addToEventsSpy).toHaveBeenCalled();
  });

  test('total count of events is decremented', () => {
    instance.onDeleteEvent();
    expect(instance.totalCount).toBe(4);
  });

  test('set alert state when connection is bad', () => {
    instance.onFetchEventsFail();
    expect(setAlertSpy).toHaveBeenCalledWith(constants.NO_CONNECTION);
  });

  test('redirect to signin page', () => {
    const response = {
      status: 401,
    };
    instance.onFetchEventsFail(response);
    expect(removeTokenSpy).toHaveBeenCalled();
    expect(locations.includes('/signin')).toBe(true);
  });

  test('nav to centers page', () => {
    const navToCenters = wrapper.find('.navTo.redirect-to');
    navToCenters.simulate('click');
    expect(locations.includes('/centers')).toBe(true);
  });

  test('set alert state with fetch events error', () => {
    const response = { data: { error: 'fetch events error' } };
    instance.offset = instance.limit * 2;
    instance.onFetchEventsFail(response);
    expect(instance.offset === instance.limit);
    expect(setAlertSpy).toHaveBeenCalledWith('fetch events error');
  });

  test('spinner while loading', () => {
    let spinner = wrapper.find('.fa-spinner');
    expect(spinner.exists()).toBe(false);
    wrapper.setProps({ alert: 'loading' });
    spinner = wrapper.find('.fa-spinner');
    expect(spinner.exists()).toBe(true);
  });

  test('notification shows when loading more events', () => {
    let bottomLoader = wrapper.find('.bottom-loader');
    expect(bottomLoader.exists()).toBe(false);
    wrapper.setProps({
      events: [
        {
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
        },
      ],
    });
    bottomLoader = wrapper.find('.bottom-loader');
    expect(bottomLoader.exists()).toBe(true);
  });

  test('load more events', () => {
    instance.totalCount = 3;
    window.innerHeight = 60;
    instance.loadNext();
    expect(instance.offset).toBe(instance.limit * 2);
    expect(updateEventsSpy).toHaveBeenCalled();
  });

  test('component unmount', () => {
    wrapper.unmount();
    expect(componentWillUnmountSpy).toHaveBeenCalled();
  });
});

