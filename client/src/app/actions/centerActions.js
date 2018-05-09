import { dispatch } from '../Reducers';

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
   * @param { object } center
   * @returns { void }
   */
  static editCentersState(center) {
    dispatch({
      type: 'EDIT_CENTERS_STATE',
      payload: center,
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
}

export default CenterActions;
