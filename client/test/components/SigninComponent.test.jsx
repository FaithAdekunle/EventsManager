import React from 'react';
import { mount } from 'enzyme';
import { SignInComponent } from
  '../../src/app/components/sign/SignInComponent.jsx';
import DialApi from '../../src/app/DialApi';
import OtherActions from '../../src/app/actions/otherActions';
import constants from '../../src/app/constants';

describe('Sign in component', () => {
  const locations = [];
  const history = {
    push(location) {
      locations.push(location);
    },
  };
  const wrapper = mount(<SignInComponent history={history} />);
  const instance = wrapper.instance();
  const navToSignUp = wrapper.find('.navTo.redirect-to');
  const email = wrapper.find('#email');
  const password = wrapper.find('#password');
  const signinForm = wrapper.find('form');
  const setAlertSpy = jest.spyOn(OtherActions, 'setAlert');
  const setTokenSpy = jest.spyOn(OtherActions, 'setToken');
  const loginSpy = jest.spyOn(DialApi, 'login');
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
    navToSignUp.simulate('click');
    expect(locations.includes('/signup')).toBe(true);
  });

  test('submit sign in form', () => {
    email.instance().value = 'test@test.com';
    password.instance().value = 'testpassword';
    signinForm.simulate('submit');
    expect(loginSpy).toHaveBeenCalled();
  });

  test('successful sign in', () => {
    const data = { token: 'token' };
    instance.onUserLoginSuccessful(data);
    expect(setTokenSpy).toHaveBeenCalledWith(data.token);
    expect(locations.includes('/events')).toBe(true);
  });

  test('bad connection alert', () => {
    instance.onUserLoginFail();
    expect(setAlertSpy).toHaveBeenCalledWith(constants.NO_CONNECTION);
  });

  test('array of error responses', () => {
    const response = { data: { error: ['error1', 'error2'] } };
    instance.onUserLoginFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error[0]);
  });

  test('single error responses', () => {
    const response = { data: { error: 'error' } };
    instance.onUserLoginFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error);
  });

  test('component unmounts', () => {
    wrapper.unmount();
    expect(componentWillUnmountSpy).toHaveBeenCalled();
  });
});
