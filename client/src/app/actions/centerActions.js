import axios from 'axios';
import Helpers from '../Helpers';
import { dispatch } from '../Reducers';
import OtherActions from './others';

/**
 * CenterActions component class
 */
class CenterActions {
  /**
   * action to update centers
   * @param { array } centers
   * @returns { void }
   */
  static updateCentersState(centers) {
    dispatch({
      type: 'UPDATE_CENTERS_STATE',
      payload: centers,
    });
  }

  /**
   * action to add to centers
   * @param { object } center
   * @returns { void }
   */
  static addToCentersState(center) {
    dispatch({
      type: 'ADD_TO_CENTERS_STATE',
      payload: center,
    });
  }

  /**
   * action to edit centers
   * @param { number } index
   * @param { object } center
   * @returns { void }
   */
  static editCentersState(index, center) {
    dispatch({
      type: 'EDIT_CENTERS_STATE',
      payload: { index, center },
    });
  }

  /**
   * action to empty centers
   * @returns { void }
   */
  static emptyCentersState() {
    dispatch({
      type: 'EMPTY_CENTERS_STATE',
    });
  }

  /**
   * action to update center state
   * @param { object } center
   * @returns { void }
   */
  static updateCenterState(center) {
    dispatch({
      type: 'UPDATE_CENTER_STATE',
      payload: center,
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
  static getCenter(id, beforeCenterLoad, onCenterLoadSuccessful, admin = false) {
    CenterActions.updateCenterState(null);
    beforeCenterLoad();
    axios
      .get(`${Helpers.host}/centers/${id}`)
      .then((response) => {
        onCenterLoadSuccessful();
        CenterActions.updateCenterState(response.data.center);
        if (admin) OtherActions.updateSelectedImages(response.data.center.images);
      })
      .catch(({ response }) => {
        if (response) {
          onCenterLoadSuccessful();
          OtherActions.updateAlertState(response.data.error);
        } else {
          OtherActions.updateAlertState('Looks like you\'re offline. Check internet connection.');
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
      .get(`${Helpers.host}/centers?filter=${filter}&facility=${facility}&capacity=${capacity}&offset=${offset}&limit=${limit}`)
      .then((response) => {
        onLoadSuccessful(loader);
        setTimeout(() => {
          CenterActions.updateCentersState(response.data.centers);
        }, 500);
      })
      .catch(({ response }) => {
        onLoadFail();
        if (response) {
          onLoadSuccessful(loader);
          OtherActions.updateAlertState(response.data.error);
        }
        OtherActions.updateAlertState('Looks like you\'re offline. Check internet connection.');
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
  static editCenter(credentials, token, id, onCenterEditSuccessful, onCenterEditFailed) {
    return axios
      .put(`${Helpers.host}/centers/${id}?token=${token}`, credentials)
      .then((response) => {
        onCenterEditSuccessful(response.data.center);
      })
      .catch(({ response }) => {
        onCenterEditFailed(response);
      });
  }
}

export default CenterActions;
