import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

class DeleteEvent extends React.Component {
  static propTypes = {
    eventIndex: Proptypes.number,
    events: Proptypes.array,
    deleteFromEventsState: Proptypes.func,
    updateEventIndex: Proptypes.func,
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
      .delete(`http://localhost:7777/api/v1/events/${this.props.events[this.props.eventIndex].id}?token=${appToken}`)
      .then(() => {
        this.props.updateEventIndex(null);
        this.props.deleteFromEventsState(this.props.eventIndex);
        this.confirm.classList.remove('hidden');
        this.deleting.classList.add('hidden');
        this.nullEvent();
      })
      .catch((err) => {
        if ([401, 404].includes(err.response.status)) {
          localStorage.removeItem('eventsManager');
          this.nullEvent();
          return this.props.history.push('/signin');
        }
        return window.alert(err.response ? (Array.isArray(err.response.data.err) ?
          err.response.data.err[0] : err.response.data.err) : 'Looks like you\'re offline. Check internet connection.');
      });
  }

  nullEvent() {
    const modal = $('#deleteModal');
    modal.modal('toggle');
    this.props.updateEventIndex(null);
  }

  render() {
    const { eventIndex } = this.props;
    return (
      <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="title" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="container event-delete">
              <div ref={(input) => { this.confirm = input; }}>
                <h5>Delete event{eventIndex !== null && eventIndex >= 0 ? ` "${this.props.events[eventIndex].name}"` : ''}?</h5>
                <div className="pull-right">
                  <button className="btn btn-danger" onClick={this.deleteEvent}>Yes</button>
                  <button className="btn btn-primary" onClick={this.nullEvent}>No</button>
                </div>
              </div>
              <div className="hidden" ref={(input) => { this.deleting = input; }}>
                <h5 className="text-center">deleting...</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    eventIndex: state.eventIndex,
    events: state.eventsState,
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
    updateEventIndex: (index) => {
      dispatch({
        type: 'UPDATE_EVENT_INDEX',
        payload: index,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteEvent);
