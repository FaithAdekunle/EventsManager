import React from 'react';
import { mount } from 'enzyme';
import { HomePageComponent } from
  '../../src/app/components/HomePageComponent.jsx';
import DialApi from '../../src/app/DialApi';
import OtherActions from '../../src/app/actions/OtherActions';
import constants from '../../src/app/constants';

describe('HomePageComponent', () => {
  const locations = [];
  const history = {
    push(destination) {
      locations.push(destination);
    },
  };
  const componentWillUnmountSpy = jest
    .spyOn(HomePageComponent.prototype, 'componentWillUnmount');
  const signUpSpy = jest.spyOn(DialApi, 'signup');
  const setAlertSpy = jest.spyOn(OtherActions, 'setAlert');
  const wrapper = mount(<HomePageComponent history={history} />);
  const fullname = wrapper.find('#fullname');
  const email = wrapper.find('#email');
  const password = wrapper.find('#password');
  const confirmPassword = wrapper.find('#confirmPassword');
  const seeForYourSelf = wrapper.find('.see-for-yourself');
  const signUpForm = wrapper.find('#signUpForm');
  const instance = wrapper.instance();

  it('should display alert to user', () => {
    wrapper.setProps({ alert: 'this is a test' });
    const alert = wrapper.find('.form-error');
    expect(alert.exists()).toBe(true);
    expect(alert.text()).toBe('this is a test');
  });

  it('should call action to alert user of invalid data', () => {
    fullname.instance().value = 'Test Name';
    email.instance().value = 'test@test.com';
    password.instance().value = 'testpassword';
    confirmPassword.instance().value = 'testConfirmPassword';
    signUpForm.simulate('submit');
    expect(setAlertSpy)
      .toHaveBeenCalledWith('Password and Confirm password must match');
  });

  it('should submit signup form with valid data', () => {
    confirmPassword.instance().value = 'testpassword';
    signUpForm.simulate('submit');
    expect(signUpSpy).toHaveBeenCalled();
  });

  it('should add centers path link to locations array', () => {
    seeForYourSelf.simulate('click');
    expect(locations.includes('/centers')).toBe(true);
  });

  it('should add events path to locations array', () => {
    instance.onSignupSuccessful({ token: 'token' });
    expect(locations.includes('/events')).toBe(true);
  });

  it('should call action to alert user of poor connection', () => {
    instance.onSignupFail();
    expect(setAlertSpy).toHaveBeenCalledWith(constants.NO_CONNECTION);
  });

  it('should call action to alert user of  error response', () => {
    const response = { data: { error: 'error' } };
    instance.onSignupFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error);
  });

  it('should call componentWillUnmount method', () => {
    wrapper.unmount();
    expect(componentWillUnmountSpy).toHaveBeenCalled();
  });
});
