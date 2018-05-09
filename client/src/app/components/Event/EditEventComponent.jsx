import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import EventActions from '../../actions/eventActions';
import OtherActions from '../../actions/otherActions';
import Helpers from '../../Helpers';
import DialApi from '../../DialApi';

/**
 * EditEvent component class
 */
class EditEvent extends React.Component {
  static propTypes = {
    token: Proptypes.string,
    alert: Proptypes.string,
    eventState: Proptypes.object,
    history: Proptypes.object,
  }

  /**
   * constructor
   */
  constructor() {
    super();
    this.onEventEditFail = this.onEventEditFail.bind(this);
    this.onEventEditSuccessful = this.onEventEditSuccessful.bind(this);
    this.submitEvent = this.submitEvent.bind(this);
    this.nullEvent = this.nullEvent.bind(this);
    this.changeDateFormat = this.changeDateFormat.bind(this);
  }

  /**
   * executes after component updates
   * @returns { void }
   */
  componentDidUpdate() {
    const event = this.props.eventState;
    if (event && event.action === 'edit') {
      const modal = $('#editModal');
      modal.modal({
        show: true,
        keyboard: false,
        backdrop: 'static',
      });
    }
  }

  /**
   * executes after event has been created/edited succesfully
   * @param { object } event
   * @returns { void }
   */
  onEventEditSuccessful(event) {
    this.spinner.classList.add('hidden');
    EventActions.editEventsState(event);
    this.nullEvent();
  }

  /**
   * executes after attempt to create/edit event fails
   * @param { object } response
   * @returns { void }
   */
  onEventEditFail(response) {
    this.fieldset.disabled = false;
    this.spinner.classList.add('hidden');
    if (!response) {
      return OtherActions.updateAlertState(`Looks like you're offline. 
      Check internet connection.`);
    }
    if ([401, 404].includes(response.status)) {
      this.nullEvent();
      OtherActions.removeToken();
      return this.props.history.push('/signin');
    }
    return OtherActions.updateAlertState(Array.isArray(response.data.error) ?
      response.data.error[0] : response.data.error);
  }

  /**
   * create/edit event
   * @param { object } event
   * @returns { void }
   */
  submitEvent(event) {
    event.preventDefault();
    this.fieldset.disabled = true;
    this.spinner.classList.remove('hidden');
    const credentials = {
      name: this.eventName.value,
      type: this.eventType.value,
      guests: this.eventGuests.value,
      start: this.changeDateFormat('start'),
      end: this.changeDateFormat('end'),
      centerId: this.props.eventState.event.centerId,
    };
    DialApi.editEvent(
      this.props.eventState.event.id,
      credentials,
      this.props.token,
      this.onEventEditSuccessful,
      this.onEventEditFail,
    );
  }

  /**
   * reformats date for submission to server or display on client
   * @param { string } startOrEnd
   * @param { boolean } toServer
   * @returns { void }
   */
  changeDateFormat(startOrEnd, toServer = true) {
    if (toServer) {
      const dateSplit = this[startOrEnd].value.split('-');
      return `${dateSplit[2]}/${dateSplit[1]}/${dateSplit[0]}`;
    }
    const dateSplit = this.props.eventState.event[startOrEnd].split('/');
    return `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`;
  }

  /**
   * executes when edit modal closes or when event has been added/edited
   * @returns { void }
   */
  nullEvent() {
    const { alert } = this.props;
    this.form.reset();
    this.fieldset.disabled = false;
    const modal = $('#editModal');
    modal.modal('hide');
    if (alert) {
      if (!alert.includes('Check internet connection')) {
        OtherActions.updateAlertState(null);
      }
    }
    EventActions.updateEventState(null);
  }

  /**
   * renders component in browser
   * @returns { component } to be rendered on the page
   */
  render() {
    const { eventState } = this.props;
    if (eventState) {
      const { event } = eventState;
      return (
        <div
          className="modal fade"
          id="editModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="title"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div>
                <div className="modal-header">
                  <h5 className="modal-title" id="title">
                    Edit Event
                    <i
                      className="fa fa-spinner fa-spin hidden"
                      ref={(input) => { this.spinner = input; }}
                      aria-hidden="true"
                    />
                  </h5>
                  <button
                    className="close"
                    type="button"
                    aria-label="Close"
                    onClick={this.nullEvent}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div
                  className={this.props.alert ?
                      'form-error text-center' : 'no-visible'}
                >
                  {this.props.alert}
                </div>
                <fieldset ref={(input) => { this.fieldset = input; }}>
                  <form
                    ref={(input) => { this.form = input; }}
                    onSubmit={this.submitEvent}
                  >
                    <div className="modal-body">
                      <div className="form-group">
                        <label htmlFor="name" className="col-form-label">
                          Name
                        </label>
                        <input
                          ref={(input) => { this.eventName = input; }}
                          required
                          type="text"
                          className="form-control"
                          id="name"
                          defaultValue={event.name}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="center" className="col-form-label">
                          Center
                        </label>
                        <input
                          id="center"
                          required
                          type="text"
                          defaultValue={event.center.name}
                          className="form-control form-control"
                          disabled
                        />
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <div className="form-group">
                            <label htmlFor="start" className="col-form-label">
                              Start Date
                            </label>
                            <input
                              ref={(input) => { this.start = input; }}
                              required
                              type="date"
                              className="form-control"
                              id="start"
                              defaultValue={this
                                .changeDateFormat('start', false)}
                            />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-group">
                            <label htmlFor="end" className="col-form-label">
                              End Date
                            </label>
                            <input
                              ref={(input) => { this.end = input; }}
                              required
                              type="date"
                              className="form-control"
                              id="end"
                              defaultValue={this
                                .changeDateFormat('end', false)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row last-row">
                        <div className="col-7">
                          <div className="form-group">
                            <label htmlFor="type" className="col-form-label">
                              Event type
                            </label>
                            <select
                              ref={(input) => { this.eventType = input; }}
                              required
                              id="type"
                              className="custom-select form-control"
                            >
                              {Helpers.centerTypes.map(type => (
                                <option
                                  key={type}
                                  value={type}
                                  selected={type === event.type}
                                >
                                  {type}
                                </option>
                                ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-5">
                          <div className="form-group">
                            <label htmlFor="guests" className="col-form-label">
                              Guests
                            </label>
                            <input
                              ref={(input) => { this.eventGuests = input; }}
                              required
                              type="number"
                              className="form-control"
                              id="guests"
                              defaultValue={event.guests}
                              min="0"
                              max={event.center.capacity}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="submit" className="btn btn-primary">
                          Save changes
                        </button>
                      </div>
                    </div>
                  </form>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = state => ({
  token: state.token,
  alert: state.alertState,
  eventState: state.eventState,
});

export default connect(mapStateToProps)(EditEvent);
