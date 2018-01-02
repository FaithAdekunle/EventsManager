import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import Event from './EventComponent';
import EditEvent from './EditEventComponent';
import DeleteEvent from './DeleteEventComponent';

class Events extends React.Component {
  static propTypes = {
    history: Proptypes.object,
    eventsState: Proptypes.array,
    alertState: Proptypes.string,
    updateEventsState: Proptypes.func,
    updateAlertState: Proptypes.func,
    updateUserState: Proptypes.func,
    updateLoginState: Proptypes.func,
  }

  componentDidMount() {
    this.props.updateAlertState('loading');
    const eventsManager = JSON.parse(localStorage.getItem('eventsManager'));
    if (!eventsManager) return this.props.history.push('/signin');
    const { appToken } = eventsManager;
    return axios
      .get(`http://andela-events-manager.herokuapp.com/api/v1/events?token=${appToken}`)
      .then((response) => {
        this.props.updateEventsState(response.data);
        this.props.updateAlertState(null);
      })
      .catch((err) => {
        if (!err.response) this.props.updateAlertState('Looks like you\'re offline. Check internet connection.');
        else {
          localStorage.removeItem('eventsManager');
          this.props.updateUserState({ email: null, fullname: null });
          this.props.updateLoginState({ userIsSignedIn: false, userIsAdmin: false });
          this.props.updateAlertState(null);
          this.props.history.push('/signin');
        }
      });
  }

  componentWillUnmount() {
    this.props.updateAlertState(null);
  }

  openModal() {
    const modal = $('#editModal');
    modal.modal({
      show: true,
      keyboard: false,
      backdrop: 'static',
    });
  }

  render() {
    const spinner = (
      <i className="fa fa-spinner fa-spin" aria-hidden="true" />
    );
    return (
      <div className="container events-container">
        <div className="row">
          <div className="col-md-10 offset-md-1">
            <div className="row my-events">
              <div className="col-8">
                <h5>My Events | {this.props.alertState === 'loading' ? spinner : this.props.eventsState.length}</h5>
              </div>
              <div className="col-4">
                <button className="btn btn-block btn-outline-primary" onClick={this.openModal}>Add Event</button>
              </div>
            </div>
            <div className={this.props.alertState !== 'Looks like you\'re offline. Check internet connection.' ? 'hidden' : ''}>
              <div className="alert alert-info" role="alert">
                <strong>{this.props.alertState}</strong>
              </div>
            </div>
            <div className="row events">
              <div className={`container ${this.props.eventsState.length === 0 && this.props.alertState !== 'loading' ? '' : 'hidden'}`}>
                <h5>You have no registered events yet. Click add event above.</h5>
              </div>
              {this.props.eventsState.map((event, index) => {
                return (
                  <div className="col-lg-6">
                    <Event event={event} key={event.id} index={index} />
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
    eventsState: state.eventsState,
    alertState: state.alertState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAlertState: (msg) => {
      dispatch({
        type: 'UPDATE_ALERT_STATE',
        payload: msg,
      });
    },
    updateEventsState: (events) => {
      dispatch({
        type: 'UPDATE_EVENTS_STATE',
        payload: events,
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

export default connect(mapStateToProps, mapDispatchToProps)(Events);

