import React from 'react';
import { mount } from 'enzyme';
import { SignInComponent } from
  '../../src/app/components/Sign/SigninComponent.jsx';
import DialApi from '../../src/app/DialApi';
import OtherActions from '../../src/app/actions/OtherActions';
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

  it('should display alert to user', () => {
    wrapper.setProps({ alert: 'this is a test' });
    alert = wrapper.find('.form-error');
    expect(alert.exists()).toBe(true);
    expect(alert.text()).toBe('this is a test');
  });

  it('should navigate to signup page', () => {
    navToSignUp.simulate('click');
    expect(locations.includes('/signup')).toBe(true);
  });

  it('should submit sign in form', () => {
    email.instance().value = 'test@test.com';
    password.instance().value = 'testpassword';
    signinForm.simulate('submit');
    expect(loginSpy).toHaveBeenCalled();
  });

  it('should add events path to locations array', () => {
    const response = { token: 'token' };
    instance.onUserLoginSuccessful(response);
    expect(setTokenSpy).toHaveBeenCalledWith(response.token);
    expect(locations.includes('/events')).toBe(true);
  });

  it('should call action to alert user of poor connection', () => {
    instance.onUserLoginFail();
    expect(setAlertSpy).toHaveBeenCalledWith(constants.NO_CONNECTION);
  });

  it('should call action to alert user of first error response', () => {
    const response = { data: { error: ['error1', 'error2'] } };
    instance.onUserLoginFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error[0]);
  });

  it('should call action to alert user of error response', () => {
    const response = { data: { error: 'error' } };
    instance.onUserLoginFail(response);
    expect(setAlertSpy).toHaveBeenCalledWith(response.data.error);
  });

  it('should call componentWillUnmount method before unmounting', () => {
    wrapper.unmount();
    expect(componentWillUnmountSpy).toHaveBeenCalled();
  });
});
