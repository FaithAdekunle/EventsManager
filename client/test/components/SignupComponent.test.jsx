import React from 'react';
import { mount } from 'enzyme';
import { SignUpComponent } from
  '../../src/app/components/Sign/SignupComponent.jsx';
import DialApi from '../../src/app/DialApi';
import OtherActions from '../../src/app/actions/OtherActions';
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

  it('should display alert to user', () => {
    wrapper.setProps({ alert: 'this is a test' });
    alert = wrapper.find('.form-error');
    expect(alert.exists()).toBe(true);
    expect(alert.text()).toBe('this is a test');
  });

  it('should add signin path to locations array', () => {
    navToSignIn.simulate('click');
    expect(locations.includes('/signin')).toBe(true);
  });

  it('should call action to alert user of invalid form data', () => {
    email.instance().value = 'test@test.com';
    password.instance().value = 'testpassword';
    confirmPassword.instance().value = 'testpasswordconfirm';
    fullname.instance().value = 'test name';
    signupForm.simulate('submit');
    expect(setAlertSpy)
      .toHaveBeenCalledWith('Password and Confirm password must match');
  });

  it('should call submit event handler on signup form', () => {
    confirmPassword.instance().value = 'testpassword';
    signupForm.simulate('submit');
    expect(signupSpy).toHaveBeenCalled();
  });

  it('should add events path to locations array', () => {
    const response = { token: 'token' };
    instance.onSignupSuccessful(response);
    expect(setTokenSpy).toHaveBeenCalledWith(response.token);
    expect(locations.includes('/events')).toBe(true);
  });

  it('should call action to alert user of poor connection', () => {
    instance.onSignupFail();
    expect(setAlertSpy).toHaveBeenCalledWith(constants.NO_CONNECTION);
  });

  it('should call action alert user of first of error responses', () => {
    const response = { data: { error: ['error1', 'error2'] } };
    instance.onSignupFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error[0]);
  });

  it('should call action to alert user of error response', () => {
    const response = { data: { error: 'error' } };
    instance.onSignupFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error);
  });

  it('should call componentWillUnmount method before unmounting', () => {
    wrapper.unmount();
    expect(componentWillUnmountSpy).toHaveBeenCalled();
  });
});
