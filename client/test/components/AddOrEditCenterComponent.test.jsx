import React from 'react';
import { mount } from 'enzyme';
import { AddOrEditCenterComponent } from
  '../../src/app/components/Center/AddOrEditCenterComponent.jsx';
import OtherActions from '../../src/app/actions/otherActions';
import CenterActions from '../../src/app/actions/centerActions';
import constants from '../../src/app/constants';

describe('center details component', () => {
  const locations = [];
  const images = [];
  const history = {
    push(location) {
      locations.push(location);
    },
  };
  const center = {
    id: 1,
    name: 'Test Center',
    address: 'Test address',
    capacity: 20,
    description: 'Test description',
    images: ['test image 1'],
    facilities: ['Tables'],
  };
  const onCenterAdded = () => null;
  const wrapper = mount(<AddOrEditCenterComponent
    images={images}
    center={center}
    onCenterAdded={onCenterAdded}
    history={history}
  />);
  const instance = wrapper.instance();
  const componentWilLUnmountSpy = jest
    .spyOn(instance, 'componentWillUnmount');
  const setAlertSpy = jest.spyOn(OtherActions, 'setAlert');
  const setImagesSpy = jest.spyOn(OtherActions, 'setImages');
  const setCenterSpy = jest.spyOn(CenterActions, 'setCenter');

  test('add or edit center successful', () => {
    instance.onSuccessful(center);
    expect(setCenterSpy).toHaveBeenCalled();
  });

  test('add or edit fail with no response', () => {
    instance.onFail();
    expect(setAlertSpy).toHaveBeenCalledWith(constants.NO_CONNECTION);
  });

  test('add or edit fail with error response', () => {
    const response = { data: { error: 'error' } };
    instance.onFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error);
  });

  test('unauthorized add or edit', () => {
    const response = { status: 401 };
    instance.onFail(response);
    expect(locations.includes('/signin')).toBe(true);
  });

  test('update facilities', () => {
    const e = {
      target: {
        value: 'Chairs',
        checked: true,
      },
    };
    instance.updateFacilities(e);
    expect(instance.facilities.Chairs).toBe(true);
  });

  test('compute checked facilities', () => {
    expect(instance.computeFacilities()).toBe('Tables###:###:###Chairs');
  });

  test('update selected images', () => {
    instance.updateImages();
    expect(setImagesSpy).toHaveBeenCalled();
  });

  test('add or edit center with no images', () => {
    const e = {
      preventDefault() {},
    };
    instance.submitCenter(e);
    expect(setAlertSpy).toHaveBeenCalledWith('Choose one or more image(s)');
  });

  test('add or edit center with no facilities', () => {
    instance.facilities = {};
    const e = {
      preventDefault() {},
    };
    instance.submitCenter(e);
    expect(setAlertSpy).toHaveBeenCalledWith('select one or more facilities');
  });

  test('component unmounts', () => {
    wrapper.unmount();
    expect(componentWilLUnmountSpy).toHaveBeenCalled();
  });
});
