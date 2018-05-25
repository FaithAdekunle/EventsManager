import React from 'react';
import { mount } from 'enzyme';
import { HomePageComponent } from
  '../../src/app/components/HomePageComponent.jsx';
import DialApi from '../../src/app/DialApi';
import OtherActions from '../../src/app/actions/otherActions';

describe('HomePageComponent', () => {
  const locations = [];
  const history = {
    push(destination) {
      locations.push(destination);
    },
  };
  const changeFormStateSpy = jest
    .spyOn(HomePageComponent.prototype, 'changeFormState');
  const componentDidMountSpy = jest
    .spyOn(HomePageComponent.prototype, 'componentDidMount');
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

  test('component mounts', () => {
    expect(componentDidMountSpy).toHaveBeenCalled();
  });

  test('submit signup form with invalid data', () => {
    fullname.instance().value = 'Test Name';
    email.instance().value = 'test@test.com';
    password.instance().value = 'testpassword';
    confirmPassword.instance().value = 'testConfirmPassword';
    signUpForm.simulate('submit');
    expect(setAlertSpy).toHaveBeenCalled();
  });

  test('submit signup form with valid data', () => {
    confirmPassword.instance().value = 'testpassword';
    signUpForm.simulate('submit');
    expect(signUpSpy).toHaveBeenCalled();
  });

  test('nav to centers page', () => {
    seeForYourSelf.simulate('click');
    expect(locations.includes('/centers')).toBe(true);
  });

  test('successful signup', () => {
    instance.onSignupSuccessful();
    expect(locations.includes('/events')).toBe(true);
  });

  test('failed signup', () => {
    instance.onSignupFail();
    expect(changeFormStateSpy).toHaveBeenCalledWith(false);
  });

  test('component unmounts', () => {
    wrapper.unmount();
    expect(componentWillUnmountSpy).toHaveBeenCalled();
  });
});
