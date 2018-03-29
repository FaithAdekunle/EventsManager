import axios from 'axios';
import Helpers from '../Helpers';
import { dispatch } from '../Reducers';
import OtherActions from './others';


class CenterActions {
  static updateCentersState(centers) {
    dispatch({
      type: 'UPDATE_CENTERS_STATE',
      payload: centers,
    });
  }

  static addToCentersState(center) {
    dispatch({
      type: 'ADD_TO_CENTERS_STATE',
      payload: center,
    });
  }

  static editCentersState(index, center) {
    dispatch({
      type: 'EDIT_CENTERS_STATE',
      payload: { index, center },
    });
  }

  static updateCenterState(center) {
    dispatch({
      type: 'UPDATE_CENTER_STATE',
      payload: center,
    });
  }

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
      .get(`${Helpers.localHost}/centers/${id}`)
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

  static updateCenters(loader) {
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
      .get(`${Helpers.localHost}/centers`)
      .then((response) => {
        loaded = true;
        loader.style.width = '100%';
        CenterActions.updateCentersState(response.data);
        setTimeout(() => { loader.classList.remove('success-background'); }, 500);
      })
      .catch(() => OtherActions.updateAlertState('Looks like you\'re offline. Check internet connection.'));
  }

  static addCenter(credentials, token, onCenterAddSuccessful, onCenterAddFail) {
    return axios
      .post(`${Helpers.localHost}/centers?token=${token}`, credentials)
      .then((response) => {
        onCenterAddSuccessful(response);
      })
      .catch((err) => {
        onCenterAddFail(err);
      });
  }

  static editCenter(credentials, token, id, onCenterEditSuccessful, onCenterEditFailed) {
    return axios
      .put(`${Helpers.localHost}/centers/${id}?token=${token}`, credentials)
      .then((response) => {
        onCenterEditSuccessful(response);
      })
      .catch((err) => {
        onCenterEditFailed(err);
      });
  }
}

export default CenterActions;
