import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

class EditEvent extends React.Component {
  static propTypes = {
    eventState: Proptypes.object,
    centerTypes: Proptypes.array,
    centersState: Proptypes.array,
    addToEventsState: Proptypes.func,
    editEventsState: Proptypes.func,
    updateEventState: Proptypes.func,
    updateUserState: Proptypes.func,
    updateLoginState: Proptypes.func,
    history: Proptypes.object,
  }

  constructor() {
    super();
    this.submitEvent = this.submitEvent.bind(this);
    this.nullEvent = this.nullEvent.bind(this);
  }

  submitEvent(event) {
    event.preventDefault();
    const { appToken } = JSON.parse(localStorage.getItem('eventsManager'));
    const credentials = {
      name: this.eventName.value,
      type: this.eventType.value,
      guests: this.eventGuests.value,
      days: this.eventDays.value,
      start: this.eventDate.value,
      centerId: this.eventCenter.value,
    };
    this.form.disabled = true;
    this.spinner.classList.remove('hidden');
    if (this.props.eventState) {
      axios
        .put(`http://andela-events-manager.herokuapp.com/api/v1/events/${this.props.eventState.id}?token=${appToken}`, credentials)
        .then((response) => {
          this.props.editEventsState(this.props.eventState.index, response.data);
        })
        .catch((err) => {
          if ([401, 404].includes(err.response.status)) {
            localStorage.removeItem('eventsManager');
            this.props.updateUserState({ email: null, fullname: null });
            this.props.updateLoginState({ userIsSignedIn: false, userIsAdmin: false });
            return this.props.history.push('/signin');
          }
          this.form.disabled = false;
          this.spinner.classList.add('hidden');
          return window.alert(err.response ? (Array.isArray(err.response.data.err) ?
            err.response.data.err[0] : err.response.data.err) : 'Looks like you\'re offline. Check internet connection.');
        });
    } else {
      axios
        .post(`http://andela-events-manager.herokuapp.com/api/v1/events?token=${appToken}`, credentials)
        .then((response) => {
          this.props.addToEventsState(response.data);
        })
        .catch((err) => {
          if ([401, 404].includes(err.response.status)) {
            localStorage.removeItem('eventsManager');
            this.props.updateUserState({ email: null, fullname: null });
            this.props.updateLoginState({ userIsSignedIn: false, userIsAdmin: false });
            return this.props.history.push('/signin');
          }
          this.form.disabled = false;
          this.spinner.classList.add('hidden');
          return window.alert(err.response ? (Array.isArray(err.response.data.err) ?
            err.response.data.err[0] : err.response.data.err) : 'Looks like you\'re offline. Check internet connection.');
        });
    }
  }

  nullEvent() {
    this.props.updateEventState(null);
  }

  render() {
    const { eventState, centersState, centerTypes } = this.props;
    return (
      <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="title" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="title">{`${this.props.eventState ? 'Edit event' : 'Add Event'} `}<i className="fa fa-spinner fa-spin hidden" ref={(input) => { this.spinner = input; }} aria-hidden="true" /></h5>
              <button className="close" type="button" data-dismiss="modal" aria-label="Close" onClick={this.nullEvent}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <fieldset ref={(input) => { this.form = input; }}>
              <form onSubmit={this.submitEvent}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="name" className="col-form-label">Name</label>
                    <input ref={(input) => { this.eventName = input; }} required type="text" className="form-control" id="name" defaultValue={eventState ? eventState.name : null} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="center" className="col-form-label">Center</label>
                    <select ref={(input) => { this.eventCenter = input; }} className="custom-select form-control">
                      {centersState.map((center) => {
                    return (
                      <option
                        defaultValue={center.id}
                        key={center.id}
                        selected={eventState ? eventState.id === center.id : false}
                      >
                        {center.name}
                      </option>
                    );
                  })}
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-5">
                      <div className="form-group">
                        <label htmlFor="days" className="col-form-label">Days</label>
                        <input ref={(input) => { this.eventDays = input; }} required type="number" className="form-control" id="days" defaultValue={eventState ? eventState.days : null} />
                      </div>
                    </div>
                    <div className="col-7">
                      <div className="form-group">
                        <label htmlFor="date" className="col-form-label">Start Date</label>
                        <input ref={(input) => { this.eventDate = input; }} required type="date" className="form-control" id="date" defaultValue={eventState ? eventState.start : null} />
                      </div>
                    </div>
                  </div>
                  <div className="row last-row">
                    <div className="col-7">
                      <div className="form-group">
                        <label htmlFor="type" className="col-form-label">Event type</label>
                        <select ref={(input) => { this.eventType = input; }} required id="type" className="custom-select form-control" defaultValue={eventState ? eventState.type : null}>
                          {centerTypes.map((type) => {
                            return (
                              <option
                                key={type}
                                defaultValue={type}
                              >{type}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="col-5">
                      <div className="form-group">
                        <label htmlFor="guests" className="col-form-label">Guests</label>
                        <input ref={(input) => { this.eventGuests = input; }} required type="number" className="form-control" id="guests" defaultValue={eventState ? eventState.guests : null} />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">{eventState ? 'Save Changes' : 'Add Event'}</button>
                  </div>
                </div>
              </form>
            </fieldset>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    centersState: state.centersState,
    centerTypes: state.centerTypes,
    eventState: state.eventState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToEventsState: (event) => {
      dispatch({
        type: 'ADD_TO_EVENTS_STATE',
        payload: event,
      });
    },
    editEventsState: (index, event) => {
      dispatch({
        type: 'EDIT_EVENTS_STATE',
        payload: {
          index,
          event,
        },
      });
    },
    updateEventState: (event) => {
      dispatch({
        type: 'UPDATE_EVENT_STATE',
        payload: event,
      });
    },
    updateLoginState: (loginState) => {
      dispatch({
        type: 'UPDATE_LOGIN_STATE',
        payload: loginState,
      });
    },
    updateUserState: (user) => {
      dispatch({
        type: 'UPDATE_USER_STATE',
        payload: user,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditEvent);
