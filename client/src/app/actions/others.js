import { dispatch } from '../Reducers';

class OtherActions {
  static updateToken(token) {
    dispatch({
      type: 'UPDATE_TOKEN',
      payload: token,
    });
  }

  static removeToken() {
    dispatch({
      type: 'REMOVE_TOKEN',
    });
  }

  static updatePageLimit() {
    dispatch({
      type: 'UPDATE_CENTERS_PAGE_LIMIT',
    });
  }

  static resetPageLimit() {
    dispatch({
      type: 'RESET_CENTERS_PAGE_LIMIT',
    });
  }

  static updatePageState(pageState) {
    dispatch({
      type: 'UPDATE_PAGE_STATE',
      payload: pageState,
    });
  }

  static updateCenterSearch(result) {
    dispatch({
      type: 'UPDATE_CENTER_SEARCH',
      payload: result,
    });
  }

  static updateCenterFilter(value) {
    dispatch({
      type: 'UPDATE_CENTER_FILTER',
      payload: value,
    });
  }

  static updateAlertState(msg) {
    dispatch({
      type: 'UPDATE_ALERT_STATE',
      payload: msg,
    });
  }

  static updateSelectedImages(images) {
    dispatch({
      type: 'UPDATE_SELECTED_IMAGES',
      payload: images,
    });
  }
}

export default OtherActions;
