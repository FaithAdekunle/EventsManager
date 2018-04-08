import axios from 'axios';
import Helpers from '../Helpers';
import { dispatch } from '../Reducers';
import OtherActions from './others';
import CenterActions from './centerActions';

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
   * @param { object } event
   * @returns { void }
   */
  static addToEventsState(event) {
    dispatch({
      type: 'ADD_TO_EVENTS_STATE',
      payload: event,
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

  /**
   * action to fetch and events
   * @param { string } token
   * @param { function } onFetchEventsSuccessful
   * @param { function } onFetchEventsFail
   * @returns { void }
   */
  static updateEvents(token, onFetchEventsSuccessful, onFetchEventsFail) {
    OtherActions.updateAlertState('loading');
    return axios
      .get(`${Helpers.host}/events?token=${token}`)
      .then((response) => {
        onFetchEventsSuccessful(response);
      })
      .catch((err) => {
        if (!err.response) OtherActions.updateAlertState('Looks like you\'re offline. Check internet connection.');
        else {
          onFetchEventsFail(err);
        }
      });
  }

  /**
   * action to add new event from centers page
   * @param { object } credentials
   * @param { string } token
   * @param { function } onEventSubmitSuccessful
   * @param { function } onEventSubmitFail
   * @returns { void }
   */
  static addEventFromCenter(credentials, token, onEventSubmitSuccessful, onEventSubmitFail) {
    axios
      .post(`${Helpers.host}/events?token=${token}`, credentials)
      .then(() => {
        onEventSubmitSuccessful();
      })
      .catch((err) => {
        onEventSubmitFail(err);
      });
  }

  /**
   * action to add new event or edit event
   * @param { object } eventState
   * @param { object } credentials
   * @param { string } token
   * @param { function } onEventEditOrAddSuccessful
   * @param { function } onEventEditOrAddFail
   * @returns { void }
   */
  static addOrEditEvent(
    eventState,
    credentials,
    token,
    onEventEditOrAddSuccessful,
    onEventEditOrAddFail,
  ) {
    if (eventState !== null) {
      axios
        .put(`${Helpers.host}/events/${eventState.id}?token=${token}`, credentials)
        .then((response) => {
          EventActions.editEventsState(response.data);
          onEventEditOrAddSuccessful();
        })
        .catch((err) => {
          onEventEditOrAddFail(err);
        });
    } else {
      axios
        .post(`${Helpers.host}/events?token=${token}`, credentials)
        .then((response) => {
          EventActions.addToEventsState(response.data);
          onEventEditOrAddSuccessful();
        })
        .catch((err) => {
          onEventEditOrAddFail(err);
        });
    }
  }

  /**
   * action to delete an event
   * @param { object } eventState
   * @param { string } token
   * @param { function } onDeleteSuccessful
   * @param { function } onDeleteFail
   * @returns { void }
   */
  static deleteEvent(eventState, token, onDeleteSuccessful, onDeleteFail) {
    axios
      .delete(`${Helpers.host}/events/${eventState.id}?token=${token}`)
      .then(() => {
        onDeleteSuccessful();
      })
      .catch((err) => {
        onDeleteFail(err);
      });
  }

  /**
   * action to delete an event
   * @param { object } center
   * @param { number } id
   * @param { number } index
   * @param { string } token
   * @param { function } onDeleteSuccessful
   * @param { function } onDeleteFail
   * @returns { void }
   */
  static declineEvent(center, id, index, token) {
    return axios
      .put(`${Helpers.host}/events/${id}/decline?token=${token}`)
      .then(() => {
        const update = { ...center };
        center.events[index].isAccepted = false;
        CenterActions.updateCenterState(update);
      });
  }
}

export default EventActions;
