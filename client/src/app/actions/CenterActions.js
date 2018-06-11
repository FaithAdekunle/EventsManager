import Reducers from '../Reducers';
import constants from '../constants';

const { dispatch } = Reducers;

/**
 * CenterActions component class
 */
class CenterActions {
  /**
   * action to update centers
   * @param { array } centers
   * @returns { void }
   */
  static setCenters(centers) {
    dispatch({
      type: constants.SET_CENTERS,
      payload: centers,
    });
  }

  /**
   * action to add to centers
   * @param { object } center
   * @returns { void }
   */
  static addToCenters(center) {
    dispatch({
      type: constants.ADD_TO_CENTERS,
      payload: center,
    });
  }

  /**
   * action to update center state
   * @param { object } center
   * @returns { void }
   */
  static setCenter(center) {
    dispatch({
      type: constants.SET_CENTER,
      payload: center,
    });
  }
}

export default CenterActions;
