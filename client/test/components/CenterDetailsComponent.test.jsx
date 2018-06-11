import React from 'react';
import { mount } from 'enzyme';
import { CenterDetailsComponent } from
  '../../src/app/components/Center/CenterDetailsComponent.jsx';
import DialApi from '../../src/app/DialApi';
import OtherActions from '../../src/app/actions/OtherActions';
import CenterActions from '../../src/app/actions/CenterActions';
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

  it('should open modal to book center', () => {
    CenterDetailsComponent.openSubmitModal();
    expect($Spy).toHaveBeenCalledWith('#submitModal');
    expect(modalSpy).toHaveBeenCalledTimes(1);
  });

  it('should open modal to edit center', () => {
    instance.openEditModal();
    expect(setImagesSpy).toHaveBeenCalled();
    expect($Spy).toHaveBeenCalledWith('#centerModal');
    expect(modalSpy).toHaveBeenCalledTimes(2);
  });

  it('should call componentDidUpdate method when component updates', () => {
    wrapper.setProps({ match: { params: { id: 2 } }, history });
    expect(componentDidUpdateSpy).toHaveBeenCalled();
  });

  it('should call action to set center state', () => {
    const response = { center: 'center' };
    instance.onCenterLoadSuccessful(response);
    expect(setCenterSpy).toHaveBeenCalledWith(response.center);
  });

  it('should call action to set alert state for poor connection', () => {
    instance.onCenterLoadFail();
    expect(setAlertSpy).toHaveBeenCalledWith(constants.NO_CONNECTION);
  });

  it('should call action to set alert state to error response', () => {
    const response = { data: { error: 'error' } };
    instance.onCenterLoadFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error);
  });

  it('should call action to add new event when center is booked', () => {
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

  it('should add events path to locations array when center is booked', () => {
    wrapper.setProps({ history });
    instance.onEventSubmitSuccessful();
    expect(locations.includes('/events')).toBe(true);
  });

  it('sshould call action to alert user for poor connection', () => {
    instance.onEventSubmitFail();
    expect(setAlertSpy).toHaveBeenLastCalledWith(constants.NO_CONNECTION);
  });

  it('should call action to alert user of error response', () => {
    const response = { data: { error: 'error1' } };
    instance.onEventSubmitFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error);
  });

  it('should display alert to user', () => {
    wrapper.setProps({ alert: constants.NO_CONNECTION });
    const alert = wrapper.find('.alert.alert-info');
    expect(alert.exists()).toBe(true);
    expect(alert.text()).toBe(constants.NO_CONNECTION);
  });

  it(
    'should add signin path to locations array for unauthorized center booking',
    () => {
      const response = { status: 401 };
      instance.onEventSubmitFail(response);
      expect(locations.includes('/signin')).toBe(true);
    },
  );

  it('should call componentWillUnmount method befor unmounting', () => {
    wrapper.unmount();
    expect(componentWilLUnmountSpy).toHaveBeenCalled();
  });
});
