import Reducers from '../Reducers';
import constants from '../constants';

const { dispatch } = Reducers;

/**
 * OtherActions component class
 */
class OtherActions {
  /**
   * action to update token
   * @param { string } token
   * @returns { void }
   */
  static setToken(token) {
    dispatch({
      type: constants.SET_TOKEN,
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
      type: constants.REMOVE_TOKEN,
    });
  }

  /**
   * action to update center search results
   * @param { array } result
   * @returns { void }
   */
  static setSearchResults(result) {
    dispatch({
      type: constants.SET_SEARCH_RESULTS,
      payload: result,
    });
  }

  /**
   * action to update app alert message
   * @param { string } msg
   * @returns { void }
   */
  static setAlert(msg) {
    dispatch({
      type: constants.SET_ALERT,
      payload: msg,
    });
  }

  /**
   * action to update selected center images
   * @param { array } images
   * @returns { void }
   */
  static setImages(images) {
    dispatch({
      type: constants.SET_IMAGES,
      payload: images,
    });
  }

  /**
   * action to update pagination metadata
   * @param { object } pagination
   * @returns { void }
   */
  static setPagination(pagination) {
    dispatch({
      type: constants.SET_PAGINATION_METADATA,
      payload: pagination,
    });
  }
}

export default OtherActions;
