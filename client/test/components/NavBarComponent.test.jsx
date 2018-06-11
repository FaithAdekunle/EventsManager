import React from 'react';
import { mount } from 'enzyme';
import { NavBarComponent } from
  '../../src/app/components/NavBarComponent.jsx';
import DialApi from '../../src/app/DialApi';
import OtherActions from '../../src/app/actions/OtherActions';
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
  const setAlertSpy = jest.spyOn(OtherActions, 'setAlert');
  const wrapper = mount(<NavBarComponent
    location={location}
    history={history}
    searchResults={searchResults}
  />);
  const onFocusSpy = jest.spyOn(wrapper.instance(), 'onFocus');
  const searchSubmitSpy = jest.spyOn(NavBarComponent, 'searchSubmit');
  let foundCenter;
  const homeLink = wrapper.find('.home');
  const centersLink = wrapper.find('.centers-link');
  let searchCenters = wrapper.find('.search-centers');
  const searchResult = wrapper.find('.search-result');
  const searchForm = wrapper.find('.search-form');

  describe('navbar for unauthenticated user', () => {
    const signInLink = wrapper.find('.signin');
    const signUpLink = wrapper.find('.signup');

    it('should display links for unauthenticated user', () => {
      expect(homeLink.exists()).toBe(true);
      expect(searchCenters.exists()).toBe(true);
      expect(searchCenters.hasClass('hidden')).toBe(false);
      expect(searchResult.exists()).toBe(true);
      expect(signInLink.exists()).toBe(true);
      expect(signUpLink.exists()).toBe(true);
    });

    it('should call action to set search results', () => {
      searchCenters.simulate('keyup');
      expect(setSearchResultsSpy).toHaveBeenCalled();
    });

    it('should call action to update search results', () => {
      searchCenters.instance().value = 'search';
      searchCenters.simulate('keyup');
      expect(updateSearchSpy).toHaveBeenCalled();
    });

    it('should call onFocus event handler', () => {
      searchCenters.simulate('focus');
      expect(onFocusSpy).toHaveBeenCalled();
    });

    it('should call onSubmit event handler', () => {
      searchForm.simulate('submit');
      expect(searchSubmitSpy).toHaveBeenCalled();
    });

    it('should add centers path to locations array', () => {
      centersLink.simulate('click');
      expect(locations.includes('/centers')).toBe(true);
    });

    it('should add signin path to locations array', () => {
      signInLink.simulate('click');
      expect(locations.includes('/signin')).toBe(true);
    });

    it('should add sugnup path to locations array', () => {
      signUpLink.simulate('click');
      expect(locations.includes('/signup')).toBe(true);
    });

    it('should add home path to locations array', () => {
      homeLink.simulate('click');
      expect(locations.includes('/')).toBe(true);
    });

    it('should display search results', () => {
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
      expect(foundCenter.text()).toBe('Test Center - Test Center Address');
    });

    it('should add centers/1 path to locations array', () => {
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
    it('should display links for authenticated user', () => {
      expect(signInLink.exists()).toBe(false);
      expect(signUpLink.exists()).toBe(false);
      expect(dropDownLink.exists()).toBe(true);
      expect(myEventsLink.exists()).toBe(true);
      expect(signoutLink.exists()).toBe(true);
    });

    it('should add events path to locations array', () => {
      myEventsLink.simulate('click');
      expect(locations.includes('/events')).toBe(true);
    });

    it('should add home path to locations array', () => {
      signoutLink.simulate('click');
      expect(removeTokenSpy).toHaveBeenCalled();
      expect(locations.includes('/')).toBe(true);
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
    it('should display links for authenticated admin', () => {
      expect(myEventsLink.exists()).toBe(false);
      expect(signoutLink.exists()).toBe(true);
    });

    it('should add home path to locations array', () => {
      signoutLink.simulate('click');
      expect(removeTokenSpy).toHaveBeenCalled();
      expect(locations.includes('/')).toBe(true);
    });

    it('should display message for no search results', () => {
      wrapper.setProps({ searchResults: [{ name: 'no centers found' }] });
      foundCenter = wrapper.find('.window-exclude.list-group-item');
      expect(foundCenter.text()).toBe('no centers found');
    });

    it('should not display search form', () => {
      wrapper.setProps({
        location: { pathname: '/centers' },
      });
      searchCenters = wrapper.find('.search-centers');
      expect(searchCenters.exists()).toBe(false);
    });
  });

  describe('navbar search for centers', () => {
    it('should call action to alert user of poor connection', () => {
      NavBarComponent.onSearchFail();
      expect(setAlertSpy).toHaveBeenCalledWith(constants.NO_CONNECTION);
    });

    it('should call action to set search results', () => {
      NavBarComponent.onSearchSuccessful([]);
      expect(setSearchResultsSpy).toHaveBeenCalledTimes(2);
      NavBarComponent.onSearchSuccessful(['center1']);
      expect(setSearchResultsSpy).toHaveBeenCalledTimes(3);
    });
  });
});
