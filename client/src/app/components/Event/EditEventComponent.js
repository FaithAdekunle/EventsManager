import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

class EditEvent extends React.Component {
  static propTypes = {
    eventIndex: Proptypes.number,
    eventsState: Proptypes.array,
    centerTypes: Proptypes.array,
    centersState: Proptypes.array,
    addToEventsState: Proptypes.func,
    editEventsState: Proptypes.func,
    updateEventIndex: Proptypes.func,
    history: Proptypes.object,
  }

  constructor() {
    super();
    this.submitEvent = this.submitEvent.bind(this);
    this.nullEvent = this.nullEvent.bind(this);
    this.getCenterId = this.getCenterId.bind(this);
    this.changeDateFormat = this.changeDateFormat.bind(this);
  }

  getCenterId() {
    const centerName = this.eventCenter.value;
    let centerId = 0;
    this.props.centersState.map((center) => {
      if (center.name === centerName) centerId = center.id;
      return null;
    });
    return centerId;
  }

  changeDateFormat(toServer = true) {
    if (toServer) {
      const dateSplit = this.eventDate.value.split('-');
      return `${dateSplit[2]}/${dateSplit[1]}/${dateSplit[0]}`;
    }
    const dateSplit = this.props.eventsState[this.props.eventIndex].start.split('/');
    return `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`;
  }

  submitEvent(event) {
    event.preventDefault();
    const { appToken } = JSON.parse(localStorage.getItem('eventsManager'));
    const credentials = {
      name: this.eventName.value,
      type: this.eventType.value,
      guests: this.eventGuests.value,
      days: this.eventDays.value,
      start: this.changeDateFormat(),
      centerId: this.getCenterId(),
    };
    this.fieldset.disabled = true;
    this.spinner.classList.remove('hidden');
    if (this.props.eventIndex !== null) {
      axios
        .put(`http://localhost:7777/api/v1/events/${this.props.eventsState[this.props.eventIndex].id}?token=${appToken}`, credentials)
        .then((response) => {
          this.props.editEventsState(this.props.eventIndex, response.data);
          this.spinner.classList.add('hidden');
          this.nullEvent();
        })
        .catch((err) => {
          if ([401, 404].includes(err.response.status)) {
            localStorage.removeItem('eventsManager');
            return this.props.history.push('/signin');
          }
          this.fieldset.disabled = false;
          this.spinner.classList.add('hidden');
          return window.alert(err.response ? (Array.isArray(err.response.data.err) ?
            err.response.data.err[0] : err.response.data.err) : 'Looks like you\'re offline. Check internet connection.');
        });
    } else {
      axios
        .post(`http://localhost:7777/api/v1/events?token=${appToken}`, credentials)
        .then((response) => {
          this.props.addToEventsState(response.data);
          this.spinner.classList.add('hidden');
          this.nullEvent();
        })
        .catch((err) => {
          if ([401, 404].includes(err.response.status)) {
            localStorage.removeItem('eventsManager');
            return this.props.history.push('/signin');
          }
          this.fieldset.disabled = false;
          this.spinner.classList.add('hidden');
          return window.alert(err.response ? (Array.isArray(err.response.data.err) ?
            err.response.data.err[0] : err.response.data.err) : 'Looks like you\'re offline. Check internet connection.');
        });
    }
  }

  nullEvent() {
    this.form.reset();
    this.fieldset.disabled = false;
    this.props.updateEventIndex(null);
    const modal = $('#editModal');
    modal.modal('toggle');
  }

  render() {
    const {
      eventIndex, eventsState, centersState, centerTypes,
    } = this.props;
    let event = null;
    if (eventIndex >= 0) event = eventsState[eventIndex];
    return (
      <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="title" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            {
              eventIndex >= 0 ? (
                <div>
                  <div className="modal-header">
                    <h5 className="modal-title" id="title">{`${event ? 'Edit event' : 'Add Event'} `}<i className="fa fa-spinner fa-spin hidden" ref={(input) => { this.spinner = input; }} aria-hidden="true" /></h5>
                    <button className="close" type="button" aria-label="Close" onClick={this.nullEvent}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <fieldset ref={(input) => { this.fieldset = input; }}>
                    <form ref={(input) => { this.form = input; }} onSubmit={this.submitEvent}>
                      <div className="modal-body">
                        <div className="form-group">
                          <label htmlFor="name" className="col-form-label">Name</label>
                          <input ref={(input) => { this.eventName = input; }} required type="text" className="form-control" id="name" defaultValue={event ? event.name : ''} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="center" className="col-form-label">Center</label>
                          <select ref={(input) => { this.eventCenter = input; }} className="custom-select form-control">
                            {centersState.map((center) => {
                          return (
                            <option
                              defaultValue={center.id}
                              key={center.id}
                              selected={event ? event.id === center.id : false}
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
                              <input ref={(input) => { this.eventDays = input; }} required type="number" className="form-control" id="days" defaultValue={event ? event.days : ''} />
                            </div>
                          </div>
                          <div className="col-7">
                            <div className="form-group">
                              <label htmlFor="date" className="col-form-label">Start Date</label>
                              <input ref={(input) => { this.eventDate = input; }} required type="date" className="form-control" id="date" defaultValue={event ? this.changeDateFormat(false) : ''} />
                            </div>
                          </div>
                        </div>
                        <div className="row last-row">
                          <div className="col-7">
                            <div className="form-group">
                              <label htmlFor="type" className="col-form-label">Event type</label>
                              <select ref={(input) => { this.eventType = input; }} required id="type" className="custom-select form-control">
                                {centerTypes.map((type) => {
                                  return (
                                    <option
                                      key={type}
                                      defaultValue={type}
                                      selected={event ? type === event.type : false}
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
                              <input ref={(input) => { this.eventGuests = input; }} required type="number" className="form-control" id="guests" defaultValue={event ? event.guests : ''} />
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button type="submit" className="btn btn-primary">{event ? 'Save Changes' : 'Add Event'}</button>
                        </div>
                      </div>
                    </form>
                  </fieldset>
                </div>
              ) : null
            }
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
    eventIndex: state.eventIndex,
    eventsState: state.eventsState,
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
    updateEventIndex: (index) => {
      dispatch({
        type: 'UPDATE_EVENT_INDEX',
        payload: index,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditEvent);
