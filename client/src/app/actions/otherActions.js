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
   * action to update pagination metadata
   * @param { object } pagination
   * @returns { void }
   */
  static updatePagination(pagination) {
    dispatch({
      type: 'UPDATE_PAGINATION_STATE',
      payload: pagination,
    });
  }
}

export default OtherActions;
