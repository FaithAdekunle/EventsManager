import React from 'react';
import { mount } from 'enzyme';
import { EditEventComponent } from
  '../../src/app/components/Event/EditEventComponent.jsx';
import EventActions from '../../src/app/actions/EventActions';
import OtherActions from '../../src/app/actions/OtherActions';
import DialApi from '../../src/app/DialApi';
import constants from '../../src/app/constants';

describe('edit event component', () => {
  const alert = 'test alert';
  const eventState = {
    action: 'edit',
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
  const componentWillUnmountSpy = jest
    .spyOn(EditEventComponent.prototype, 'componentWillUnmount');
  const componentDidUpdateSpy = jest
    .spyOn(EditEventComponent.prototype, 'componentDidUpdate');
  const setAlertSpy = jest.spyOn(OtherActions, 'setAlert');
  const removeTokenSpy = jest.spyOn(OtherActions, 'removeToken');
  const editEventsSpy = jest.spyOn(DialApi, 'editEvent');
  const updateEventsSpy = jest.spyOn(EventActions, 'updateEvents');
  const setEventSpy = jest.spyOn(EventActions, 'setEvent');
  const wrapper = mount(<EditEventComponent />);
  const instance = wrapper.instance();

  it('should call componentDidUpdate method when component updates', () => {
    wrapper.setProps({ alert, eventState, history });
    expect(componentDidUpdateSpy).toHaveBeenCalled();
  });

  it('should prefill form fields', () => {
    const nameField = wrapper.find('#name');
    const centerField = wrapper.find('#center');
    const startField = wrapper.find('#start');
    const endField = wrapper.find('#end');
    const typeField = wrapper.find('#type');
    const guestsField = wrapper.find('#guests');
    expect(nameField.instance().value).toBe(eventState.event.name);
    expect(centerField.instance().value).toBe(eventState.event.center.name);
    expect(startField.instance().value).toBe('2018-05-22');
    expect(endField.instance().value).toBe('2018-05-22');
    expect(typeField.instance().value).toBe(eventState.event.type);
    expect(guestsField.instance().value).toBe(eventState.event.guests);
  });

  it('should display alert to user', () => {
    wrapper.setProps({ alert: 'this is a test' });
    const alertWrapper = wrapper.find('.form-error');
    expect(alertWrapper.exists()).toBe(true);
    expect(alertWrapper.text()).toBe('this is a test');
  });

  it('should call action to edit events', () => {
    const editForm = wrapper.find('form');
    editForm.simulate('submit');
    expect(editEventsSpy).toHaveBeenCalled();
  });

  it('should call action to alert user of poor connection', () => {
    instance.onEventEditFail();
    expect(setAlertSpy).toHaveBeenCalledWith(constants.NO_CONNECTION);
  });

  it(
    'should add signin path to locations array after unauthorized delete',
    () => {
      const response = { status: 401 };
      instance.onEventEditFail(response);
      expect(removeTokenSpy).toHaveBeenCalled();
      expect(locations.includes('/signin')).toBe(true);
    },
  );

  it('should call action to alert user of first error response', () => {
    const response = { data: { error: ['error1', 'error2'] } };
    instance.onEventEditFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error[0]);
  });

  it('should call action to alert user of error response', () => {
    const response = { data: { error: 'error' } };
    instance.onEventEditFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error);
  });

  it('should call action to replace edited event in state', () => {
    instance.onEventEditSuccessful(eventState.event);
    expect(updateEventsSpy).toHaveBeenCalled();
  });

  it('should close edit event modal', () => {
    const closeModal = wrapper.find('.close');
    closeModal.simulate('click');
    expect(setEventSpy).toHaveBeenCalledWith(null);
  });

  it('should call componentWillUnmount method before unmounting', () => {
    wrapper.unmount();
    expect(componentWillUnmountSpy).toHaveBeenCalled();
  });
});

