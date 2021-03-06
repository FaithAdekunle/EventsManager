import React from 'react';
import { shallow } from 'enzyme';
import { EventsComponent } from
  '../../src/app/components/Event/EventsComponent.jsx';
import EventActions from '../../src/app/actions/EventActions';
import OtherActions from '../../src/app/actions/OtherActions';
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
  it('should call action to set alert state to loading', () => {
    expect(setAlertSpy).toHaveBeenCalledWith('loading');
  });

  it('should call action to add to events state', () => {
    const response = {
      metaData: { pagination: { totalCount: 5 } },
      events: [],
    };
    instance.onFetchEventsSuccessful(response);
    expect(setAlertSpy).toHaveBeenCalledWith(null);
    expect(instance.totalCount).toBe(5);
    expect(addToEventsSpy).toHaveBeenCalled();
  });

  it('should decrement totalCount component property', () => {
    expect(instance.totalCount).toBe(5);
    instance.onDeleteEvent();
    expect(instance.totalCount).toBe(4);
  });

  it('should call action to alert user of poor connection', () => {
    instance.onFetchEventsFail();
    expect(setAlertSpy).toHaveBeenCalledWith(constants.NO_CONNECTION);
  });

  it(
    'should add signin path to locations array after unauthorized fetch',
    () => {
      const response = {
        status: 401,
      };
      instance.onFetchEventsFail(response);
      expect(removeTokenSpy).toHaveBeenCalled();
      expect(locations.includes('/signin')).toBe(true);
    },
  );

  it('should add centers path to locations array', () => {
    const navToCenters = wrapper.find('.navTo.redirect-to');
    navToCenters.simulate('click');
    expect(locations.includes('/centers')).toBe(true);
  });

  it('should call action to alert user of error response', () => {
    const response = { data: { error: 'fetch events error' } };
    instance.offset = instance.limit * 2;
    instance.onFetchEventsFail(response);
    expect(instance.offset === instance.limit);
    expect(setAlertSpy).toHaveBeenCalledWith('fetch events error');
  });

  it('should display spinner while loading', () => {
    let spinner = wrapper.find('.fa-spinner');
    expect(spinner.exists()).toBe(false);
    wrapper.setProps({ alert: 'loading' });
    spinner = wrapper.find('.fa-spinner');
    expect(spinner.exists()).toBe(true);
  });

  it('should display bottom loader when loading more events', () => {
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

  it('should display alert to user', () => {
    wrapper.setProps({ alert: 'this is a test' });
    const alert = wrapper.find('.alert.alert-info>strong');
    expect(alert.exists()).toBe(true);
    expect(alert.text()).toBe('this is a test');
  });

  it('should call action to update events after loading more events', () => {
    instance.totalCount = 3;
    window.innerHeight = 60;
    instance.loadNext();
    expect(instance.offset).toBe(instance.limit * 2);
    expect(updateEventsSpy).toHaveBeenCalled();
  });

  it('should call componentWillUnmount method before unmounting', () => {
    wrapper.unmount();
    expect(componentWillUnmountSpy).toHaveBeenCalled();
  });
});

