import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

class DeleteEvent extends React.Component {
  static propTypes = {
    eventState: Proptypes.object,
    deleteFromEventsState: Proptypes.func,
    updateEventState: Proptypes.func,
    updateUserState: Proptypes.func,
    updateLoginState: Proptypes.func,
    history: Proptypes.object,
  }

  constructor() {
    super();
    this.deleteEvent = this.deleteEvent.bind(this);
    this.nullEvent = this.nullEvent.bind(this);
  }

  deleteEvent() {
    const { appToken } = JSON.parse(localStorage.getItem('eventsManager'));
    this.confirm.classList.add('hidden');
    this.deleting.classList.remove('hidden');
    axios
      .delete(`http://andela-events-manager.herokuapp.com/api/v1/events/${this.props.eventState.id}?token=${appToken}`)
      .then(() => {
        this.props.deleteFromEventsState(this.props.eventState.index);
        this.confirm.classList.remove('hidden');
        this.deleting.classList.add('hidden');
        this.nullEvent();
      })
      .catch((err) => {
        if ([401, 404].includes(err.response.status)) {
          localStorage.removeItem('eventsManager');
          this.props.updateUserState({ email: null, fullname: null });
          this.props.updateLoginState({ userIsSignedIn: false, userIsAdmin: false });
          return this.props.history.push('/signin');
        }
        return window.alert(err.response ? (Array.isArray(err.response.data.err) ?
          err.response.data.err[0] : err.response.data.err) : 'Looks like you\'re offline. Check internet connection.');
      });
  }

  nullEvent() {
    const modal = $('#deleteModal');
    modal.modal('toggle');
    this.props.updateEventState(null);
  }

  render() {
    const { eventState } = this.props;
    if (eventState) {
      return (
        <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="title" aria-hidden="true">
          <div className="modal-dialog modal-sm" role="document">
            <div className="modal-content">
              <div className="container">
                <div ref={(input) => { this.confirm = input; }}>
                  <h5>Delete event {eventState.name}?</h5>
                  <div className="pull-right">
                    <button className="btn btn-danger btn-sm" onClick={this.deleteEvent}>Yes</button>
                    <button className="btn btn-primary btn-sm" onClick={this.nullEvent}>No</button>
                  </div>
                </div>
                <div className="hidden" ref={(input) => { this.deleting = input; }}>
                  <h5>deleting...</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    eventState: state.eventState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteFromEventsState: (index) => {
      dispatch({
        type: 'DELETE_FROM_EVENTS_STATE',
        payload: index,
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

export default connect(mapStateToProps, mapDispatchToProps)(DeleteEvent);
