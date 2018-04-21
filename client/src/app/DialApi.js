import axios from 'axios';
import CenterActions from './actions/centerActions';
import EventActions from './actions/eventActions';
import OtherActions from './actions/otherActions';
import Helpers from './Helpers';


module.exports = class DialApi {
  /**
   * fetch user events
   * @param { string } token
   * @param { function } onFetchEventsFail
   * @returns { void }
   */
  static updateEvents(token, onFetchEventsFail) {
    OtherActions.updateAlertState('loading');
    return axios
      .get(`${Helpers.host}/events?token=${token}`)
      .then((response) => {
        OtherActions.updateAlertState(null);
        EventActions.updateEventsState(response.data.events);
      })
      .catch((err) => {
        if (!err.response) {
          OtherActions
            .updateAlertState(`Looks like you're offline. 
            Check internet connection.`);
        } else {
          onFetchEventsFail(err.response);
        }
      });
  }

  /**
   * fetch center events
   * @param { string } centerId
   * @param { string } beforeLoad
   * @param { string } onLoadSuccessful
   * @param { string } upcoming
   * @param { string } offset
   * @param { string } limit
   * @param { function } onLoadFail
   * @returns { void }
   */
  static updateCenterEvents(
    centerId,
    beforeLoad,
    onLoadSuccessful,
    upcoming = false,
    offset = 0,
    limit = 0,
    onLoadFail,
  ) {
    beforeLoad();
    return axios
      .get(`${Helpers.host}/${centerId}/events?upcoming=${upcoming}&offset=` +
      `${offset}&limit=${limit}`)
      .then(({ data }) => {
        onLoadSuccessful(data.events);
        OtherActions.updateAlertState(null);
        EventActions.addToEventsState(data.events);
      })
      .catch(({ response }) => {
        onLoadFail();
        if (!response) {
          OtherActions
            .updateAlertState(`Looks like you're offline. 
            Check internet connection.`);
        }
      });
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
      .then(() => {
        onEventSubmitSuccessful();
      })
      .catch((err) => {
        onEventSubmitFail(err.response);
      });
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
      .then((response) => {
        EventActions.editEventsState(response.data);
        onEventEditSuccessful();
      })
      .catch(({ response }) => {
        onEventEditFail(response);
      });
  }

  /**
   * action to delete an event
   * @param { object } eventState
   * @param { string } token
   * @param { function } onDeleteSuccessful
   * @param { function } onDeleteFail
   * @returns { void }
   */
  static deleteEvent(eventState, token, onDeleteSuccessful, onDeleteFail) {
    axios
      .delete(`${Helpers.host}/events/${eventState.id}?token=${token}`)
      .then(() => {
        onDeleteSuccessful();
      })
      .catch(({ response }) => {
        onDeleteFail(response);
      });
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
   * @param { boolean } admin
   * @returns { void }
   */
  static getCenter(
    id,
    beforeCenterLoad,
    onCenterLoadSuccessful,
    admin = false,
  ) {
    CenterActions.updateCenterState(null);
    beforeCenterLoad();
    axios
      .get(`${Helpers.host}/centers/${id}`)
      .then((response) => {
        onCenterLoadSuccessful();
        CenterActions.updateCenterState(response.data.center);
        if (admin) {
          OtherActions.updateSelectedImages(response.data.center.images);
        }
      })
      .catch(({ response }) => {
        if (response) {
          onCenterLoadSuccessful();
          OtherActions.updateAlertState(response.data.error);
        } else {
          OtherActions
            .updateAlertState(`Looks like 
            you're offline. Check internet connection.`);
        }
      });
  }

  /**
   * action to update centers state
   * @param { object } loader
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
    loader,
    beforeLoad,
    onLoadSuccessful,
    onLoadFail,
    offset = 0,
    limit = 0,
    filter = '',
    facility = '',
    capacity = 1,
  ) {
    OtherActions.updateAlertState(null);
    beforeLoad(loader);
    axios
      .get(`${Helpers.host}/centers?filter=${filter}&facility=` +
      `${facility}&capacity=${capacity}&offset=${offset}&limit=${limit}`)
      .then(({ data }) => {
        onLoadSuccessful(loader);
        setTimeout(() => {
          CenterActions.updateCentersState(data.centers);
        }, 500);
      })
      .catch(({ response }) => {
        onLoadFail();
        if (response) {
          onLoadSuccessful(loader);
          OtherActions.updateAlertState(response.data.error);
        }
        OtherActions
          .updateAlertState(`Looks like you're offline. 
          Check internet connection.`);
      });
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
      .then((response) => {
        onCenterAddSuccessful(response.data.center);
      })
      .catch(({ response }) => {
        onCenterAddFail(response);
      });
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
      .then((response) => {
        onCenterEditSuccessful(response.data.center);
      })
      .catch(({ response }) => {
        onCenterEditFailed(response);
      });
  }

  /**
   * action to log a user in
   * @param { function } beforeLogin
   * @param { object } credentials
   * @param { function } onLoginSuccessful
   * @param { function } onLoginFail
   * @returns { void }
   */
  static login(beforeLogin, credentials, onLoginSuccessful, onLoginFail) {
    beforeLogin();
    axios
      .post(`${Helpers.host}/users/login`, credentials)
      .then(({ data }) => {
        OtherActions.updateToken(data.token);
        onLoginSuccessful();
      })
      .catch(({ response }) => {
        onLoginFail();
        if (!response) {
          OtherActions
            .updateAlertState(`Looks like you're offline. 
            Check internet connection.`);
        } else {
          OtherActions.updateAlertState(Array.isArray(response.data.error) ?
            response.data.error[0] : response.data.error);
        }
        setTimeout(() => OtherActions.updateAlertState(null), 10000);
      });
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
      .then(({ data }) => {
        OtherActions.updateToken(data.token);
        onSignupSuccessful();
      })
      .catch(({ response }) => {
        onSignupFail(response);
        if (!response) {
          OtherActions
            .updateAlertState(`Looks like you're offline. 
            Check internet connection.`);
        } else {
          OtherActions.updateAlertState(Array.isArray(response.data.error) ?
            response.data.error[0] : response.data.error);
        }
        setTimeout(() => OtherActions.updateAlertState(null), 10000);
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
        OtherActions.updateCenterSearch(response.data.centers);
      })
      .catch(({ response }) => {
        if (!response) {
          OtherActions
            .updateAlertState(`Looks like you're offline. 
            Check internet connection.`);
        }
      });
  }
};
