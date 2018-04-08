import axios from 'axios';
import Helpers from '../Helpers';
import { dispatch } from '../Reducers';

/**
 * OtherActions component class
 */
class OtherActions {
  /**
   * action to update token
   * @param { string } token
   * @returns { void }
   */
  static updateToken(token) {
    dispatch({
      type: 'UPDATE_TOKEN',
      payload: token,
    });
  }

  /**
   * action to remove token
   * @param { string } token
   * @returns { void }
   */
  static removeToken() {
    dispatch({
      type: 'REMOVE_TOKEN',
    });
  }

  /**
   * action to update page state
   * @param { object } pageState
   * @returns { void }
   */
  static updatePageState(pageState) {
    dispatch({
      type: 'UPDATE_PAGE_STATE',
      payload: pageState,
    });
  }

  /**
   * action to update center search results
   * @param { array } result
   * @returns { void }
   */
  static updateCenterSearch(result) {
    dispatch({
      type: 'UPDATE_CENTER_SEARCH',
      payload: result,
    });
  }

  /**
   * action to update app alert message
   * @param { string } msg
   * @returns { void }
   */
  static updateAlertState(msg) {
    dispatch({
      type: 'UPDATE_ALERT_STATE',
      payload: msg,
    });
  }

  /**
   * action to update selected center images
   * @param { array } images
   * @returns { void }
   */
  static updateSelectedImages(images) {
    dispatch({
      type: 'UPDATE_SELECTED_IMAGES',
      payload: images,
    });
  }

  /**
   * action to log a user in
   * @param { object } credentials
   * @param { function } onLoginSuccessful
   * @param { function } onLoginFail
   * @returns { void }
   */
  static login(credentials, onLoginSuccessful, onLoginFail) {
    axios
      .post(`${Helpers.host}/users/login`, credentials)
      .then(response => onLoginSuccessful(response))
      .catch(err => onLoginFail(err));
  }

  /**
   * action to sign a user up
   * @param { object } credentials
   * @param { function } onSignupSuccessful
   * @param { function } onSignupFail
   * @returns { void }
   */
  static signup(credentials, onSignupSuccessful, onSignupFail) {
    axios
      .post(`${Helpers.host}/users`, credentials)
      .then((response) => {
        onSignupSuccessful(response);
      })
      .catch((err) => {
        onSignupFail(err);
      });
  }

  /**
   * action to search centers by name/location
   * @param { string } filter
   * @returns { void }
   */
  static updateSearch(filter) {
    axios.get(`${Helpers.host}/centers?filter=${filter}`)
      .then((response) => {
        OtherActions.updateCenterSearch(response.data);
      })
      .catch();
  }
}

export default OtherActions;
