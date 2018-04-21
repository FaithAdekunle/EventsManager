import { dispatch } from '../Reducers';

/**
 * EventActions component class
 */
class EventActions {
  /**
   * action to update events
   * @param { array } events
   * @returns { void }
   */
  static updateEventsState(events) {
    dispatch({
      type: 'UPDATE_EVENTS_STATE',
      payload: events,
    });
  }

  /**
   * action to add to events
   * @param { object } events
   * @returns { void }
   */
  static addToEventsState(events) {
    dispatch({
      type: 'ADD_TO_EVENTS_STATE',
      payload: events,
    });
  }

  /**
   * action to edit events
   * @param { object } event
   * @returns { void }
   */
  static editEventsState(event) {
    dispatch({
      type: 'EDIT_EVENTS_STATE',
      payload: event,
    });
  }

  /**
   * action to delete event
   * @param { number } id
   * @returns { void }
   */
  static deleteFromEventsState(id) {
    dispatch({
      type: 'DELETE_FROM_EVENTS_STATE',
      payload: id,
    });
  }

  /**
   * action to update event
   * @param { object } event
   * @returns { void }
   */
  static updateEventState(event) {
    dispatch({
      type: 'UPDATE_EVENT_STATE',
      payload: event,
    });
  }
}

export default EventActions;
