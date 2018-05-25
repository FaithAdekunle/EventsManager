import React from 'react';
import { mount } from 'enzyme';
import { EditEventComponent } from
  '../../src/app/components/Event/EditEventComponent.jsx';
import EventActions from '../../src/app/actions/eventActions';
import OtherActions from '../../src/app/actions/otherActions';
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

  test('component updates', () => {
    wrapper.setProps({ alert, eventState, history });
    expect(componentDidUpdateSpy).toHaveBeenCalled();
  });

  test('edit event form fields', () => {
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

  test('submit edit event form', () => {
    const editForm = wrapper.find('form');
    editForm.simulate('submit');
    expect(editEventsSpy).toHaveBeenCalled();
  });

  test('failed edit with bad connection', () => {
    instance.onEventEditFail();
    expect(setAlertSpy).toHaveBeenCalledWith(constants.NO_CONNECTION);
  });

  test('unauthorized edit attempt', () => {
    const response = { status: 401 };
    instance.onEventEditFail(response);
    expect(removeTokenSpy).toHaveBeenCalled();
    expect(locations.includes('/signin')).toBe(true);
  });

  test('failed edit with multiple error responses', () => {
    const response = { data: { error: ['error1', 'error2'] } };
    instance.onEventEditFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error[0]);
  });

  test('failed edit with single error response', () => {
    const response = { data: { error: 'error' } };
    instance.onEventEditFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error);
  });

  test('sucessful event edit', () => {
    instance.onEventEditSuccessful(eventState.event);
    expect(updateEventsSpy).toHaveBeenCalled();
  });

  test('close edit event modal', () => {
    const closeModal = wrapper.find('.close');
    closeModal.simulate('click');
    expect(setEventSpy).toHaveBeenCalledWith(null);
  });

  test('component unmount', () => {
    wrapper.unmount();
    expect(componentWillUnmountSpy).toHaveBeenCalled();
  });
});

