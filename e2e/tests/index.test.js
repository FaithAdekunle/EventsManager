import { Signup } from '../testFiles/Signup';
import { Signin } from '../testFiles/Signin';
import { HomePageSearchForCenters, HomePageSignup } from '../testFiles/Home';
import { createAndEditEvent } from '../testFiles/createAndEditEvent';
import { deleteEvent } from '..//testFiles/deleteEvent';
import { declineEvent } from '../testFiles/declineEvent';
import { searchCenters } from '../testFiles/searchCenters';
import { editCenter } from '../testFiles/editCenter';

module.exports = {
  HomePageSearchForCenters: browser => HomePageSearchForCenters(browser),
  HomePageSignup: browser => HomePageSignup(browser),
  Signup: browser => Signup(browser),
  Signin: browser => Signin(browser),
  createAndEditEvent: browser => createAndEditEvent(browser),
  declineEvent: browser => declineEvent(browser),
  deleteEvent: browser => deleteEvent(browser),
  searchCenters: browser => searchCenters(browser),
  editCenter: browser => editCenter(browser),
};

