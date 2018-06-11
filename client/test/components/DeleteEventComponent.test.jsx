import React from 'react';
import { mount } from 'enzyme';
import { DeleteEventComponent } from
  '../../src/app/components/Event/DeleteEventComponent.jsx';
import EventActions from '../../src/app/actions/EventActions';
import OtherActions from '../../src/app/actions/OtherActions';
import DialApi from '../../src/app/DialApi';
import constants from '../../src/app/constants';

describe('delete event component', () => {
  const eventState = {
    action: 'delete',
    event: {
      id: 1,
      centerId: 1,
      isAccepted: true,
      name: 'Test Event',
      type: 'Meeting',
      guests: '20',
      start: '22/05/2018',
      end: '22/05/2018',
      center: {
        id: 1,
        name: 'Test event center',
      },
    },
  };
  const locations = [];
  const history = {
    push(location) {
      locations.push(location);
    },
  };
  const onDeleteEvent = () => null;
  const componentWillUnmountSpy = jest
    .spyOn(DeleteEventComponent.prototype, 'componentWillUnmount');
  const componentDidUpdateSpy = jest
    .spyOn(DeleteEventComponent.prototype, 'componentDidUpdate');
  const removeTokenSpy = jest.spyOn(OtherActions, 'removeToken');
  const deleteEventSpy = jest.spyOn(DialApi, 'deleteEvent');
  const deleteFromEventsSpy = jest.spyOn(EventActions, 'deleteFromEvents');
  const alertSpy = jest.spyOn(global, 'alert');
  const setEventSpy = jest.spyOn(EventActions, 'setEvent');
  const wrapper = mount(<DeleteEventComponent
    eventState={eventState}
  />);
  const yes = wrapper.find('.btn-danger');
  const no = wrapper.find('.btn-primary');
  const instance = wrapper.instance();

  it('should call componentDidUpdate method when component updates', () => {
    wrapper.setProps({ history, onDeleteEvent });
    expect(componentDidUpdateSpy).toHaveBeenCalled();
  });

  it('should call action to set event state to null', () => {
    no.simulate('click');
    expect(setEventSpy).toHaveBeenCalledWith(null);
  });

  it('should confirm event delete', () => {
    yes.simulate('click');
    expect(deleteEventSpy).toHaveBeenCalled();
  });

  it('should call action to alert user of poor connection', () => {
    instance.onDeleteFail();
    expect(alertSpy).toHaveBeenCalledWith(constants.NO_CONNECTION);
  });

  it(
    'should add signin path to locations array for unauthorized delete',
    () => {
      const response = { status: 401 };
      instance.onDeleteFail(response);
      expect(removeTokenSpy).toHaveBeenCalled();
      expect(locations.includes('/signin')).toBe(true);
    },
  );

  it('should call action to alert user of error response', () => {
    const response = { data: { error: 'error' } };
    instance.onDeleteFail(response);
    expect(alertSpy).toHaveBeenCalledWith(response.data.error);
  });

  it('should call action to remove deleted event from state', () => {
    instance.onDeleteSuccesful(eventState.event);
    expect(deleteFromEventsSpy).toHaveBeenCalled();
  });

  it('should call componentWillUnmount method before unmounting', () => {
    wrapper.unmount();
    expect(componentWillUnmountSpy).toHaveBeenCalled();
  });
});

