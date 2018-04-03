import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import Event from './EventComponent';
import EditEvent from './EditEventComponent';
import DeleteEvent from './DeleteEventComponent';
import OtherActions from '../../actions/others';
import EventActions from '../../actions/eventActions';

/**
 * Events component class
 */
class Events extends React.Component {
  static propTypes = {
    history: Proptypes.object,
    eventsState: Proptypes.array,
    alertState: Proptypes.string,
    token: Proptypes.string,
  }

  /**
   * constructor
   */
  constructor() {
    super();
    this.onFetchEventsFail = this.onFetchEventsFail.bind(this);
    this.onFetchEventsSuccessful = this.onFetchEventsSuccessful.bind(this);
  }

  /**
   * executes after component mounts
   * @returns { void }
   */
  componentDidMount() {
    EventActions
      .updateEvents(this.props.token, this.onFetchEventsSuccessful, this.onFetchEventsFail);
  }

  /**
   * executes before component unmounts
   * @returns { void }
   */
  componentWillUnmount() {
    $('#editModal').modal('hide');
    OtherActions.updateAlertState(null);
  }

  /**
   * executes after events have fetched
   * @param { object } response
   * @returns { void }
   */
  onFetchEventsSuccessful(response) {
    EventActions.updateEventsState(response.data);
    OtherActions.updateAlertState(null);
  }

  /**
   * executes after attempt to fetch events fail
   * @param { object } err
   * @returns { void }
   */
  onFetchEventsFail(err) {
    if (!err.response) OtherActions.updateAlertState('Looks like you\'re offline. Check internet connection.');
    else {
      OtherActions.removeToken();
      this.props.history.push('/signin');
    }
  }

  /**
   * opens edit modal
   * @returns { void }
   */
  openModal() {
    const modal = $('#editModal');
    modal.modal({
      show: true,
      keyboard: false,
      backdrop: 'static',
    });
  }

  /**
   * renders component in browser
   * @returns { component } to be rendered on the page
   */
  render() {
    const spinner = (
      <i className="fa fa-spinner fa-spin" aria-hidden="true" />
    );
    return (
      <div className="container events-container">
        <div className="row">
          <div className="col-lg-10 offset-lg-1">
            <div className="row my-events">
              <div className="col-8">
                <h5>My Events | {this.props.alertState === 'loading' ? spinner : this.props.eventsState.length}</h5>
              </div>
              <div className="col-4">
                <button className="btn btn-block btn-outline-primary" onClick={this.openModal}>Add Event</button>
              </div>
            </div>
            <div className={this.props.alertState === 'Looks like you\'re offline. Check internet connection.' ? '' : 'hidden'}>
              <div className="alert alert-info" role="alert">
                <strong>{this.props.alertState}</strong>
              </div>
            </div>
            <div className={`${this.props.eventsState.length === 0 && this.props.alertState !== 'loading' ? '' : 'hidden'}`}>
              <h5>You have no registered events yet. Click add event above.</h5>
            </div>
            <div className="row">
              {this.props.eventsState.map((event) => {
                return (
                  <div className="col-md-6" key={event.id}>
                    <Event
                      event={event}
                      history={this.props.history}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <EditEvent history={this.props.history} />
        <DeleteEvent history={this.props.history} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token,
    eventsState: state.eventsState,
    alertState: state.alertState,
  };
};

export default connect(mapStateToProps)(Events);

