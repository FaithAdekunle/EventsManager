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
   * @param { object } loader
   * @param { number } id
   * @param { boolean } admin
   * @returns { void }
   */
  static getCenter(loader, id, admin) {
    CenterActions.updateCenterState(null);
    let loaded = false;
    const load = (start = 0, increase = 2, interval = 50) => {
      if (!loaded && start < 70) {
        start += increase;
        loader.style.width = `${start}%`;
        if (start === 50) {
          interval = 1000;
        }
        setTimeout(() => {
          load(start, increase, interval);
        }, interval);
      }
    };
    load();
    axios
      .get(`${Helpers.host}/centers/${id}`)
      .then((response) => {
        loaded = true;
        loader.style.width = '100%';
        CenterActions.updateCenterState(response.data);
        if (admin) OtherActions.updateSelectedImages(response.data.images);
        setTimeout(() => { loader.classList.remove('success-background'); }, 500);
      })
      .catch((err) => {
        if (err.response) {
          loaded = true;
          loader.style.width = '100%';
          OtherActions.updateAlertState(err.response.data.err);
          setTimeout(() => {
            loader.classList.remove('success-background');
          }, 500);
        } else {
          OtherActions.updateAlertState('Looks like you\'re offline. Check internet connection.');
        }
      });
  }

  /**
   * action to update centers state
   * @param { object } loader
   * @param { integer} offset
   * @param { integer } limit
   * @param { string } filter
   * @param { string } facility
   * @param { integer } capacity
   * @returns { void }
   */
  static updateCenters(loader, offset = 0, limit = 0, filter = '', facility = '', capacity = 0) {
    loader.classList.add('success-background');
    let loaded = false;
    const load = (start = 0, increase = 2, interval = 50) => {
      if (!loaded && start < 70) {
        start += increase;
        loader.style.width = `${start}%`;
        if (start === 50) {
          interval = 1000;
        }
        setTimeout(() => {
          load(start, increase, interval);
        }, interval);
      }
    };
    load();
    axios
      .get(`${Helpers.host}/centers?filter=${filter}&facility=${facility}&capacity=${capacity}&offset=${offset}&limit=${limit}`)
      .then((response) => {
        loaded = true;
        loader.style.width = '100%';
        setTimeout(() => {
          loader.classList.remove('success-background');
          CenterActions.updateCentersState(response.data);
        }, 500);
      })
      .catch(() => OtherActions.updateAlertState('Looks like you\'re offline. Check internet connection.'));
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
        onCenterAddSuccessful(response);
      })
      .catch((err) => {
        onCenterAddFail(err);
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
        onCenterEditSuccessful(response);
      })
      .catch((err) => {
        onCenterEditFailed(err);
      });
  }
}

export default CenterActions;
