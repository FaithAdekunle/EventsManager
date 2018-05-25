import React from 'react';
import { mount } from 'enzyme';
import { CenterDetailsComponent } from
  '../../src/app/components/Center/CenterDetailsComponent.jsx';
import DialApi from '../../src/app/DialApi';
import OtherActions from '../../src/app/actions/otherActions';
import CenterActions from '../../src/app/actions/centerActions';
import constants from '../../src/app/constants';

describe('center details component', () => {
  const match = { params: { id: 1 } };
  const locations = [];
  const history = {
    push(location) {
      locations.push(location);
    },
  };
  const wrapper = mount(<CenterDetailsComponent
    match={match}
  />);
  const instance = wrapper.instance();
  const center = {
    id: 1,
    name: 'Test Center',
    address: 'Test address',
    capacity: 20,
    description: 'Test description',
    images: ['test image 1'],
    facilities: ['test facility 1'],
  };
  instance.props = { center };
  const componentWilLUnmountSpy = jest
    .spyOn(instance, 'componentWillUnmount');
  const componentDidUpdateSpy = jest
    .spyOn(instance, 'componentDidUpdate');
  const modalSpy = jest.spyOn($(), 'modal');
  const $Spy = jest.spyOn(global, '$');
  const setAlertSpy = jest.spyOn(OtherActions, 'setAlert');
  const setImagesSpy = jest.spyOn(OtherActions, 'setImages');
  const addEventSpy = jest.spyOn(DialApi, 'addEvent');
  const setCenterSpy = jest.spyOn(CenterActions, 'setCenter');

  test('open book center modal', () => {
    CenterDetailsComponent.openSubmitModal();
    expect($Spy).toHaveBeenCalledWith('#submitModal');
    expect(modalSpy).toHaveBeenCalledTimes(1);
  });

  test('open edit center modal', () => {
    instance.openEditModal();
    expect(setImagesSpy).toHaveBeenCalled();
    expect($Spy).toHaveBeenCalledWith('#centerModal');
    expect(modalSpy).toHaveBeenCalledTimes(2);
  });

  test('component updates', () => {
    wrapper.setProps({ match: { params: { id: 2 } }, history });
    expect(componentDidUpdateSpy).toHaveBeenCalled();
  });

  test('center load successful', () => {
    const data = { center: 'center' };
    instance.onCenterLoadSuccessful(data);
    expect(setCenterSpy).toHaveBeenCalledWith(data.center);
  });

  test('center load fail with no response', () => {
    instance.onCenterLoadFail();
    expect(setAlertSpy).toHaveBeenCalledWith(constants.NO_CONNECTION);
  });

  test('center load fail with error response', () => {
    const response = { data: { error: 'error' } };
    instance.onCenterLoadFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error);
  });

  test('book center', () => {
    instance.fieldset = {};
    instance.eventName = { value: '' };
    instance.eventType = { value: '' };
    instance.eventGuests = { value: '' };
    instance.eventStartDate = { value: '22/05/2018' };
    instance.eventEndDate = { value: '22/05/2018' };
    instance.props = { center };
    const event = {
      preventDefault() {},
    };
    instance.submitEvent(event);
    expect(addEventSpy).toHaveBeenCalled();
  });

  test('book center successful', () => {
    wrapper.setProps({ history });
    instance.onEventSubmitSuccessful();
    expect(locations.includes('/events')).toBe(true);
  });

  test('book center failed with no response', () => {
    instance.onEventSubmitFail();
    expect(setAlertSpy).toHaveBeenCalledTimes(4);
  });

  test('book center failed with error response', () => {
    const response = { data: { error: 'error1' } };
    instance.onEventSubmitFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error);
  });

  test('unauthorized center booking', () => {
    const response = { status: 401 };
    instance.onEventSubmitFail(response);
    expect(locations.includes('/signin')).toBe(true);
  });

  test('component unmounts', () => {
    wrapper.unmount();
    expect(componentWilLUnmountSpy).toHaveBeenCalled();
  });
});
