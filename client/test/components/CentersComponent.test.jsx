import React from 'react';
import { mount } from 'enzyme';
import { CentersComponent } from
  '../../src/app/components/Center/CentersComponent.jsx';
import DialApi from '../../src/app/DialApi';
import OtherActions from '../../src/app/actions/OtherActions';
import constants from '../../src/app/constants';

describe('centers component', () => {
  const centers = [];
  const wrapper = mount(<CentersComponent centers={centers} />);
  const instance = wrapper.instance();
  const componentWilLUnmountSpy = jest
    .spyOn(instance, 'componentWillUnmount');
  const updateCentersSpy = jest
    .spyOn(DialApi, 'updateCenters');
  const setAlertSpy = jest.spyOn(OtherActions, 'setAlert');
  const setPaginationSpy = jest.spyOn(OtherActions, 'setPagination');

  it('should call action to update centers when new center is added', () => {
    instance.onCenterAdded();
    expect(updateCentersSpy).toHaveBeenCalled();
  });

  it(
    'should call action to update centers when user searches for centers',
    () => {
      const searchCenterForm = wrapper.find('form');
      searchCenterForm.simulate('submit');
      expect(updateCentersSpy).toHaveBeenCalledTimes(2);
    },
  );

  it('should call action to alert user of poor connection', () => {
    instance.onLoadFail();
    expect(setAlertSpy).toHaveBeenCalledWith(constants.NO_CONNECTION);
  });

  it('should call action to alert user of error response', () => {
    const response = { data: { error: 'error' } };
    instance.onLoadFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error);
  });

  it('should display alert to user', () => {
    wrapper.setProps({ alert: constants.NO_CONNECTION });
    const alert = wrapper.find('.alert.alert-info>strong');
    expect(alert.exists()).toBe(true);
    expect(alert.text()).toBe(constants.NO_CONNECTION);
  });

  it('call action to set pagination metadata when centers are loaded', () => {
    const response = {
      centers: [],
      metaData: {
        pagination: 'pagination',
      },
    };
    instance.onLoadSuccessful(response);
    expect(setPaginationSpy)
      .toHaveBeenLastCalledWith(response.metaData.pagination);
  });

  it('should call componentWillUnmount method before unmounting', () => {
    wrapper.unmount();
    expect(componentWilLUnmountSpy).toHaveBeenCalled();
  });
});
