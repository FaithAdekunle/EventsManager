import { dispatch } from '../Reducers';
import constants from '../constants';

/**
 * EventActions component class
 */
class EventActions {
  /**
   * action to update events
   * @param { array } events
   * @returns { void }
   */
  static setEvents(events) {
    dispatch({
      type: constants.SET_EVENTS,
      payload: events,
    });
  }

  /**
   * action to add to events
   * @param { object } events
   * @returns { void }
   */
  static addToEvents(events) {
    dispatch({
      type: constants.ADD_TO_EVENTS,
      payload: events,
    });
  }

  /**
   * action to edit events
   * @param { object } event
   * @returns { void }
   */
  static updateEvents(event) {
    dispatch({
      type: constants.UPDATE_EVENTS,
      payload: event,
    });
  }

  /**
   * action to delete event
   * @param { number } id
   * @returns { void }
   */
  static deleteFromEvents(id) {
    dispatch({
      type: constants.DELETE_FROM_EVENTS,
      payload: id,
    });
  }

  /**
   * action to update event
   * @param { object } event
   * @returns { void }
   */
  static setEvent(event) {
    dispatch({
      type: constants.SET_EVENT,
      payload: event,
    });
  }
}

export default EventActions;
