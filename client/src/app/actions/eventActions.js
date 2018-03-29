import axios from 'axios';
import Helpers from '../Helpers';
import { dispatch } from '../Reducers';
import OtherActions from './others';
import CenterActions from './centerActions';


class EventActions {
  static updateEventsState(events) {
    dispatch({
      type: 'UPDATE_EVENTS_STATE',
      payload: events,
    });
  }

  static addToEventsState(event) {
    dispatch({
      type: 'ADD_TO_EVENTS_STATE',
      payload: event,
    });
  }

  static editEventsState(event) {
    dispatch({
      type: 'EDIT_EVENTS_STATE',
      payload: event,
    });
  }

  static deleteFromEventsState(id) {
    dispatch({
      type: 'DELETE_FROM_EVENTS_STATE',
      payload: id,
    });
  }

  static updateEventState(event) {
    dispatch({
      type: 'UPDATE_EVENT_STATE',
      payload: event,
    });
  }

  static updateEvents(token, history) {
    OtherActions.updateAlertState('loading');
    return axios
      .get(`${Helpers.localHost}/events?token=${token}`)
      .then((response) => {
        EventActions.updateEventsState(response.data);
        OtherActions.updateAlertState(null);
      })
      .catch((err) => {
        if (!err.response) OtherActions.updateAlertState('Looks like you\'re offline. Check internet connection.');
        else {
          OtherActions.removeToken();
          history.push('/signin');
        }
      });
  }

  static addEventFromCenter(credentials, token, onEventSubmitSuccessful, onEventSubmitFail) {
    axios
      .post(`${Helpers.localHost}/events?token=${token}`, credentials)
      .then(() => {
        onEventSubmitSuccessful();
      })
      .catch((err) => {
        onEventSubmitFail(err);
      });
  }

  static addOrEditEvent(
    eventState,
    credentials,
    token,
    onEventEditOrAddSuccessful,
    onEventEditOrAddFail,
  ) {
    if (eventState !== null) {
      axios
        .put(`${Helpers.localHost}/events/${eventState.id}?token=${token}`, credentials)
        .then((response) => {
          EventActions.editEventsState(response.data);
          onEventEditOrAddSuccessful();
        })
        .catch((err) => {
          onEventEditOrAddFail(err);
        });
    } else {
      axios
        .post(`${Helpers.localHost}/events?token=${token}`, credentials)
        .then((response) => {
          EventActions.addToEventsState(response.data);
          onEventEditOrAddSuccessful();
        })
        .catch((err) => {
          onEventEditOrAddFail(err);
        });
    }
  }

  static deleteEvent(eventState, token, onDeleteSuccessful, onDeleteFail) {
    axios
      .delete(`${Helpers.localHost}/events/${eventState.id}?token=${token}`)
      .then(() => {
        onDeleteSuccessful();
      })
      .catch((err) => {
        onDeleteFail(err);
      });
  }

  static declineEvent(center, id, index, token) {
    return axios
      .put(`${Helpers.localHost}/events/${id}/decline?token=${token}`)
      .then(() => {
        const update = { ...center };
        center.events[index].isAccepted = false;
        CenterActions.updateCenterState(update);
      });
  }
}

export default EventActions;
