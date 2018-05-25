import React from 'react';
import { mount } from 'enzyme';
import { NavBarComponent } from
  '../../src/app/components/NavBarComponent.jsx';
import DialApi from '../../src/app/DialApi';
import OtherActions from '../../src/app/actions/otherActions';
import constants from '../../src/app/constants';

describe('NavBarComponent', () => {
  let locations = [];
  const location = {};
  const searchResults = [];
  const history = {
    push(destination) {
      locations.push(destination);
    },
  };
  const updateSearchSpy = jest.spyOn(DialApi, 'updateSearch');
  const setSearchResultsSpy = jest.spyOn(OtherActions, 'setSearchResults');
  const removeTokenSpy = jest.spyOn(OtherActions, 'removeToken');
  const componentDidMountSpy = jest
    .spyOn(NavBarComponent.prototype, 'componentDidMount');
  const setAlertSpy = jest.spyOn(OtherActions, 'setAlert');
  const wrapper = mount(<NavBarComponent
    location={location}
    history={history}
    searchResults={searchResults}
  />);
  const onFocusSpy = jest.spyOn(wrapper.instance(), 'onFocus');
  const searchSubmitSpy = jest.spyOn(NavBarComponent, 'searchSubmit');
  let foundCenter;
  const home = wrapper.find('.home');
  const centersLink = wrapper.find('.centers-link');
  let searchCenters = wrapper.find('.search-centers');
  const searchResult = wrapper.find('.search-result');
  const searchForm = wrapper.find('.search-form');

  describe('navbar for unauthenticated user', () => {
    const signInLink = wrapper.find('.signin');
    const signUpLink = wrapper.find('.signup');
    test('navbar component', () => {
      expect(componentDidMountSpy).toHaveBeenCalled();
    });

    test('display for unauthenticated user', () => {
      expect(home.exists()).toBe(true);
      expect(centersLink.exists()).toBe(true);
      expect(searchCenters.exists()).toBe(true);
      expect(searchCenters.hasClass('hidden')).toBe(false);
      expect(searchResult.exists()).toBe(true);
      expect(signInLink.exists()).toBe(true);
      expect(signUpLink.exists()).toBe(true);
    });

    test('keyup event on .search-centers with no entry', () => {
      searchCenters.simulate('keyup');
      expect(setSearchResultsSpy).toHaveBeenCalled();
    });

    test('keyup event on .search-centers with entry', () => {
      searchCenters.instance().value = 'search';
      searchCenters.simulate('keyup');
      expect(updateSearchSpy).toHaveBeenCalled();
    });

    test('focus event on .search-centers with entry', () => {
      searchCenters.simulate('focus');
      expect(onFocusSpy).toHaveBeenCalled();
    });

    test('submit event on .search-form', () => {
      searchForm.simulate('submit');
      expect(searchSubmitSpy).toHaveBeenCalled();
    });

    test('nav to centers page', () => {
      centersLink.simulate('click');
      expect(locations.includes('/centers')).toBe(true);
    });

    test('nav to signin page', () => {
      signInLink.simulate('click');
      expect(locations.includes('/signin')).toBe(true);
    });

    test('nav to signup page', () => {
      signUpLink.simulate('click');
      expect(locations.includes('/signup')).toBe(true);
    });

    test('nav to home page', () => {
      home.simulate('click');
      expect(locations.includes('/home')).toBe(true);
    });

    test('serch results found', () => {
      wrapper.setProps({
        searchResults: [
          {
            id: 1,
            name: 'Test Center',
            address: 'Test Center Address',
          },
        ],
      });
      wrapper.update();
      foundCenter = wrapper.find('.window-exclude.list-group-item');
      expect(foundCenter.exists()).toBe(true);
    });

    test('nav to center details page', () => {
      foundCenter.simulate('click');
      expect(locations.includes('/centers/1')).toBe(true);
    });
  });

  describe('navbar for authenticated user', () => {
    locations = [];
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZnVsbE5hb' +
    'WUiOiJmYWl0aCBhZGVrdW5sZSIsImlzQWRtaW4iOmZhbHNlLCJleHBpcmVzIjoxNTI3NDM2' +
    'Nzk2ODkyLCJpYXQiOjE1MjY4MzE5OTZ9.Igp2aayAtu1YsiVtdL0YmqBU1z59' +
    '-3x8Z5u6nB0w0Kc';
    wrapper.setProps({
      token,
      location,
    });
    const signInLink = wrapper.find('.signin');
    const signUpLink = wrapper.find('.signup');
    const dropDownLink = wrapper.find('#navbarDropdown');
    const myEventsLink = wrapper.find('.myEvents');
    const signoutLink = wrapper.find('.signout');
    test('display for authenticated user', () => {
      expect(signInLink.exists()).toBe(false);
      expect(signUpLink.exists()).toBe(false);
      expect(dropDownLink.exists()).toBe(true);
      expect(myEventsLink.exists()).toBe(true);
      expect(signoutLink.exists()).toBe(true);
    });

    test('nav to events page', () => {
      myEventsLink.simulate('click');
      expect(locations.includes('/events')).toBe(true);
    });

    test('sign out', () => {
      signoutLink.simulate('click');
      expect(removeTokenSpy).toHaveBeenCalled();
      expect(locations.includes('/home')).toBe(true);
    });
  });

  describe('navbar for authenticated admin', () => {
    locations = [];
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZnVsbE5hb' +
    'WUiOiJhZG1pbiIsImlzQWRtaW4iOnRydWUsImV4cGlyZXMiOjE1MjY4ODQyNTE4OTQsImlhd' +
    'CI6MTUyNjg0MTA1MX0.i52yz0BHMlltCWaVoEekBE2H8iZopsbma-nJ_wm-Cng';
    wrapper.setProps({
      token,
    });
    const myEventsLink = wrapper.find('.myEvents');
    const signoutLink = wrapper.find('.signout');
    test('display for authenticated user', () => {
      expect(myEventsLink.exists()).toBe(false);
      expect(signoutLink.exists()).toBe(true);
    });

    test('sign out', () => {
      signoutLink.simulate('click');
      expect(removeTokenSpy).toHaveBeenCalled();
      expect(locations.includes('/home')).toBe(true);
    });

    test('no centers found', () => {
      wrapper.setProps({ searchResults: [{ name: 'no centers found' }] });
      foundCenter = wrapper.find('.window-exclude.list-group-item');
      expect(foundCenter.text()).toBe('no centers found');
    });

    test('on centers page', () => {
      wrapper.setProps({
        location: { pathname: '/centers' },
      });
      searchCenters = wrapper.find('.search-centers');
      expect(searchCenters.exists()).toBe(false);
    });
  });

  describe('navbar search for centers', () => {
    test('search centers fail', () => {
      NavBarComponent.onSearchFail();
      expect(setAlertSpy).toHaveBeenCalledWith(constants.NO_CONNECTION);
    });

    test('empty search result', () => {
      NavBarComponent.onSearchSuccessful([]);
      expect(setSearchResultsSpy).toHaveBeenCalledTimes(2);
    });

    test('non empty search result', () => {
      NavBarComponent.onSearchSuccessful(['center1']);
      expect(setSearchResultsSpy).toHaveBeenCalledTimes(3);
    });

    test('unmount component', () => {
      wrapper.unmount();
    });
  });
});
