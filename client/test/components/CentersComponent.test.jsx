import React from 'react';
import { mount } from 'enzyme';
import { CentersComponent } from
  '../../src/app/components/Center/CentersComponent.jsx';
import DialApi from '../../src/app/DialApi';
import OtherActions from '../../src/app/actions/otherActions';
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

  test('new center added', () => {
    instance.onCenterAdded();
    expect(updateCentersSpy).toHaveBeenCalled();
  });

  test('submit center search form', () => {
    const searchCenterForm = wrapper.find('form');
    searchCenterForm.simulate('submit');
    expect(updateCentersSpy).toHaveBeenCalledTimes(2);
  });

  test('centers load fail with no error response', () => {
    instance.onLoadFail();
    expect(setAlertSpy).toHaveBeenCalledWith(constants.NO_CONNECTION);
  });

  test('centers load fail with error response', () => {
    const response = { data: { error: 'error' } };
    instance.onLoadFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error);
  });

  test('centers load successful', () => {
    const data = {
      centers: [],
      metaData: {
        pagination: 'pagination',
      },
    };
    instance.onLoadSuccessful(data);
    expect(setPaginationSpy).toHaveBeenLastCalledWith(data.metaData.pagination);
  });

  test('component unmounts', () => {
    wrapper.unmount();
    expect(componentWilLUnmountSpy).toHaveBeenCalled();
  });
});
