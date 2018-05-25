import React from 'react';
import { mount } from 'enzyme';
import { SignUpComponent } from
  '../../src/app/components/sign/SignUpComponent.jsx';
import DialApi from '../../src/app/DialApi';
import OtherActions from '../../src/app/actions/otherActions';
import constants from '../../src/app/constants';

describe('Sign up component', () => {
  const locations = [];
  const history = {
    push(location) {
      locations.push(location);
    },
  };
  const wrapper = mount(<SignUpComponent history={history} />);
  const instance = wrapper.instance();
  const navToSignIn = wrapper.find('.navTo.redirect-to');
  const fullname = wrapper.find('#fullname');
  const email = wrapper.find('#email');
  const password = wrapper.find('#password');
  const confirmPassword = wrapper.find('#passwordconfirm');
  const signupForm = wrapper.find('form');
  const setAlertSpy = jest.spyOn(OtherActions, 'setAlert');
  const signupSpy = jest.spyOn(DialApi, 'signup');
  const setTokenSpy = jest.spyOn(OtherActions, 'setToken');
  const componentWillUnmountSpy = jest
    .spyOn(wrapper.instance(), 'componentWillUnmount');
  let alert = wrapper.find('.form-error');

  test('no props.alert', () => {
    expect(alert.exists()).toBe(false);
  });

  test('props.alert', () => {
    wrapper.setProps({ alert: 'this is a test' });
    alert = wrapper.find('.form-error');
    expect(alert.exists()).toBe(true);
    expect(alert.text()).toBe('this is a test');
  });

  test('nav to signup page', () => {
    navToSignIn.simulate('click');
    expect(locations.includes('/signin')).toBe(true);
  });

  test('submit signup form with invalid data', () => {
    email.instance().value = 'test@test.com';
    password.instance().value = 'testpassword';
    confirmPassword.instance().value = 'testpasswordconfirm';
    fullname.instance().value = 'test name';
    signupForm.simulate('submit');
    expect(setAlertSpy).toHaveBeenCalled();
  });

  test('submit signup form with valid data', () => {
    confirmPassword.instance().value = 'testpassword';
    signupForm.simulate('submit');
    expect(signupSpy).toHaveBeenCalled();
  });

  test('successful signup', () => {
    const data = { token: 'token' };
    instance.onSignupSuccessful(data);
    expect(setTokenSpy).toHaveBeenCalledWith(data.token);
    expect(locations.includes('/events')).toBe(true);
  });

  test('bad connection alert', () => {
    instance.onSignupFail();
    expect(setAlertSpy).toHaveBeenCalledWith(constants.NO_CONNECTION);
  });

  test('array of error responses', () => {
    const response = { data: { error: ['error1', 'error2'] } };
    instance.onSignupFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error[0]);
  });

  test('single error responses', () => {
    const response = { data: { error: 'error' } };
    instance.onSignupFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error);
  });

  test('component unmounts', () => {
    wrapper.unmount();
    expect(componentWillUnmountSpy).toHaveBeenCalled();
  });
});
