import React from 'react';
import { mount } from 'enzyme';
import { AddOrEditCenterComponent } from
  '../../src/app/components/Center/AddOrEditCenterComponent.jsx';
import OtherActions from '../../src/app/actions/OtherActions';
import CenterActions from '../../src/app/actions/CenterActions';
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
  const nameField = wrapper.find('input#name');
  const addressField = wrapper.find('input#address');
  const capacityField = wrapper.find('input#capacity');
  const costField = wrapper.find('input#cost');
  const descriptionField = wrapper.find('textarea#description');

  it('should prefill form fields with center details', () => {
    expect(nameField.get(0).props.defaultValue).toBe(center.name);
    expect(addressField.get(0).props.defaultValue).toBe(center.address);
    expect(capacityField.get(0).props.defaultValue).toBe(center.capacity);
    expect(costField.get(0).props.defaultValue).toBe(center.cost);
    expect(descriptionField.get(0).props.defaultValue).toBe(center.description);
  });

  it('should call action to set center after adding or editing center', () => {
    instance.onSuccessful(center);
    expect(setCenterSpy).toHaveBeenCalled();
  });

  it('should call action to alert user for poor connection', () => {
    instance.onFail();
    expect(setAlertSpy).toHaveBeenCalledWith(constants.NO_CONNECTION);
  });

  it('should call action to alert user of error response', () => {
    const response = { data: { error: 'error' } };
    instance.onFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error);
  });

  it('should display alert to user', () => {
    wrapper.setProps({ alert: 'this is a test' });
    const alertWrapper = wrapper.find('.form-error');
    expect(alertWrapper.exists()).toBe(true);
    expect(alertWrapper.text()).toBe('this is a test');
  });

  it(
    'should add signin path to locations array after unauthorized add or edit',
    () => {
      const response = { status: 401 };
      instance.onFail(response);
      expect(locations.includes('/signin')).toBe(true);
    },
  );

  it('should add Chairs to selected facilities', () => {
    const event = {
      target: {
        value: 'Chairs',
        checked: true,
      },
    };
    instance.updateFacilities(event);
    expect(instance.facilities.Chairs).toBe(true);
  });

  it(
    'should compute string of checked facilities from facilities object',
    () => {
      expect(instance.computeFacilities()).toBe('Tables###:###:###Chairs');
    },
  );

  it('should call action to set images state with selected images', () => {
    instance.updateImages();
    expect(setImagesSpy).toHaveBeenCalled();
  });

  it('should call action to alert admin to choose one or more images', () => {
    const event = {
      preventDefault() {},
    };
    instance.submitCenter(event);
    expect(setAlertSpy).toHaveBeenCalledWith('Choose one or more image(s)');
  });

  it(
    'should call action to alert admin to select one or more facilities',
    () => {
      instance.facilities = {};
      const event = {
        preventDefault() {},
      };
      instance.submitCenter(event);
      expect(setAlertSpy).toHaveBeenCalledWith('select one or more facilities');
    },
  );

  it('should call componentWillUnmount method', () => {
    wrapper.unmount();
    expect(componentWilLUnmountSpy).toHaveBeenCalled();
  });
});
