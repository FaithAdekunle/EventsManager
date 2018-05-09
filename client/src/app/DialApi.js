import axios from 'axios';
import CenterActions from './actions/centerActions';
import Helpers from './Helpers';


module.exports = class DialApi {
  /**
   * fetch user events
   * @param { string } token
   * @param { function } onFetchEventsSuccessful
   * @param { function } onFetchEventsFail
   * @param { integer } limit
   * @param { integer } offset
   * @returns { void }
   */
  static updateEvents(
    token,
    onFetchEventsSuccessful,
    onFetchEventsFail,
    limit = 'limit',
    offset = 0,
  ) {
    return axios
      .get(`${Helpers.host}/events?token=${token}&upcoming=true&` +
      `offset=${offset}&limit=${limit}&pagination=true`)
      .then(({ data }) => onFetchEventsSuccessful(data))
      .catch(({ response }) => onFetchEventsFail(response));
  }

  /**
   * fetch center events
   * @param { string } centerId
   * @param { string } beforeLoad
   * @param { string } onLoadSuccessful
   * @param { function } onLoadFail
   * @param { string } offset
   * @param { string } limit
   * @returns { void }
   */
  static updateCenterEvents(
    centerId,
    beforeLoad,
    onLoadSuccessful,
    onLoadFail,
    offset = 0,
    limit = 0,
  ) {
    beforeLoad();
    return axios
      .get(`${Helpers.host}/${centerId}/events?upcoming=true&offset=` +
      `${offset}${limit !== 0 ? `&limit=${limit}` : ''}`)
      .then(({ data }) => onLoadSuccessful(data.events))
      .catch(({ response }) => onLoadFail(response));
  }

  /**
   * action to add new event from centers page
   * @param { object } credentials
   * @param { string } token
   * @param { function } onEventSubmitSuccessful
   * @param { function } onEventSubmitFail
   * @returns { void }
   */
  static addEvent(
    credentials,
    token,
    onEventSubmitSuccessful,
    onEventSubmitFail,
  ) {
    axios
      .post(`${Helpers.host}/events?token=${token}`, credentials)
      .then(() => onEventSubmitSuccessful())
      .catch(({ response }) => onEventSubmitFail(response));
  }

  /**
   * action to add new event or edit event
   * @param { integer } id
   * @param { object } credentials
   * @param { string } token
   * @param { function } onEventEditSuccessful
   * @param { function } onEventEditFail
   * @returns { void }
   */
  static editEvent(
    id,
    credentials,
    token,
    onEventEditSuccessful,
    onEventEditFail,
  ) {
    axios
      .put(`${Helpers.host}/events/${id}?token=${token}`, credentials)
      .then(({ data }) => onEventEditSuccessful(data.event))
      .catch(({ response }) => onEventEditFail(response));
  }

  /**
   * action to delete an event
   * @param { integer } id
   * @param { string } token
   * @param { function } onDeleteSuccessful
   * @param { function } onDeleteFail
   * @returns { void }
   */
  static deleteEvent(id, token, onDeleteSuccessful, onDeleteFail) {
    axios
      .delete(`${Helpers.host}/events/${id}?token=${token}`)
      .then(() => onDeleteSuccessful())
      .catch(({ response }) => onDeleteFail(response));
  }

  /**
   * action to delete an event
   * @param { object } center
   * @param { number } id
   * @param { number } index
   * @param { string } token
   * @param { function } onDeleteSuccessful
   * @param { function } onDeleteFail
   * @returns { void }
   */
  static declineEvent(center, id, index, token) {
    return axios
      .put(`${Helpers.host}/events/${id}/decline?token=${token}`)
      .then(() => {
        const update = { ...center };
        center.events[index].isAccepted = false;
        CenterActions.updateCenterState(update);
      });
  }

  /**
   * action to update center state
   * @param { number } id
   * @param { func } beforeCenterLoad
   * @param { func } onCenterLoadSuccessful
   * @param { func } onCenterLoadFail
   * @returns { void }
   */
  static getCenter(
    id,
    beforeCenterLoad,
    onCenterLoadSuccessful,
    onCenterLoadFail,
  ) {
    beforeCenterLoad();
    axios
      .get(`${Helpers.host}/centers/${id}`)
      .then(({ data }) => onCenterLoadSuccessful(data))
      .catch(({ response }) => onCenterLoadFail(response));
  }

  /**
   * action to update centers state
   * @param { func } beforeLoad
   * @param { func } onLoadSuccessful
   * @param { func } onLoadFail
   * @param { integer} offset
   * @param { integer } limit
   * @param { string } filter
   * @param { string } facility
   * @param { integer } capacity
   * @returns { void }
   */
  static updateCenters(
    beforeLoad,
    onLoadSuccessful,
    onLoadFail,
    offset = 0,
    limit = 0,
    filter = '',
    facility = '',
    capacity = 1,
  ) {
    beforeLoad();
    axios
      .get(`${Helpers.host}/centers?filter=${filter}&facility=` +
      `${facility}&capacity=${capacity}&offset=${offset}&limit=${limit}` +
      '&pagination=true')
      .then(({ data }) => onLoadSuccessful(data))
      .catch(({ response }) => onLoadFail(response));
  }

  /**
   * action to add new center
   * @param { object } credentials
   * @param { string } token
   * @param { function } onCenterAddSuccessful
   * @param { function } onCenterAddFail
   * @returns { void }
   */
  static addCenter(credentials, token, onCenterAddSuccessful, onCenterAddFail) {
    return axios
      .post(`${Helpers.host}/centers?token=${token}`, credentials)
      .then(({ data }) => onCenterAddSuccessful(data.center))
      .catch(({ response }) => onCenterAddFail(response));
  }

  /**
   * action to edit existing center
   * @param { object } credentials
   * @param { string } token
   * @param { number } id
   * @param { function } onCenterEditSuccessful
   * @param { function } onCenterEditFailed
   * @returns { void }
   */
  static editCenter(
    credentials,
    token,
    id,
    onCenterEditSuccessful,
    onCenterEditFailed,
  ) {
    return axios
      .put(`${Helpers.host}/centers/${id}?token=${token}`, credentials)
      .then(({ data }) => {
        onCenterEditSuccessful(data.center);
      })
      .catch(({ response }) => {
        onCenterEditFailed(response);
      });
  }

  /**
   * action to log a user in
   * @param { object } credentials
   * @param { function } beforeLogin
   * @param { function } onLoginSuccessful
   * @param { function } onLoginFail
   * @returns { void }
   */
  static login(credentials, beforeLogin, onLoginSuccessful, onLoginFail) {
    beforeLogin();
    axios
      .post(`${Helpers.host}/users/login`, credentials)
      .then(({ data }) => onLoginSuccessful(data))
      .catch(({ response }) => onLoginFail(response));
  }

  /**
   * action to sign a user up
   * @param { function } beforeSignUp
   * @param { object } credentials
   * @param { function } onSignupSuccessful
   * @param { function } onSignupFail
   * @returns { void }
   */
  static signup(
    beforeSignUp,
    credentials,
    onSignupSuccessful,
    onSignupFail,
  ) {
    beforeSignUp();
    axios
      .post(`${Helpers.host}/users`, credentials)
      .then(({ data }) => onSignupSuccessful(data))
      .catch(({ response }) => onSignupFail(response));
  }

  /**
   * action to search centers by name/location
   * @param { string } filter
   * @param { function } onSearchSuccessful
   * @param { function } onSearchFail
   * @returns { void }
   */
  static updateSearch(filter, onSearchSuccessful, onSearchFail) {
    axios.get(`${Helpers.host}/centers?filter=${filter}&limit=100`)
      .then(({ data }) => onSearchSuccessful(data.centers))
      .catch(({ response }) => onSearchFail(response));
  }
};
