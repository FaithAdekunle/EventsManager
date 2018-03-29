import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import EventActions from '../../actions/eventActions';
import OtherActions from '../../actions/others';

class DeleteEvent extends React.Component {
  static propTypes = {
    token: Proptypes.string,
    eventState: Proptypes.object,
    history: Proptypes.object,
  }

  constructor() {
    super();
    this.deleteEvent = this.deleteEvent.bind(this);
    this.nullEvent = this.nullEvent.bind(this);
    this.onDeleteSuccesful = this.onDeleteSuccesful.bind(this);
  }

  onDeleteSuccesful() {
    EventActions.deleteFromEventsState(this.props.eventState);
    EventActions.updateEventState(null);
    this.confirm.classList.remove('hidden');
    this.deleting.classList.add('hidden');
    this.nullEvent();
  }

  onDeleteFail(err) {
    if ([401, 404].includes(err.response.status)) {
      OtherActions.removeToken();
      this.nullEvent();
      return this.props.history.push('/signin');
    }
    return window.alert(err.response ? (Array.isArray(err.response.data.err) ?
      err.response.data.err[0] : err.response.data.err) : 'Looks like you\'re offline. Check internet connection.');
  }

  deleteEvent() {
    this.confirm.classList.add('hidden');
    this.deleting.classList.remove('hidden');
    EventActions.deleteEvent(
      this.props.eventState,
      this.props.token,
      this.onDeleteSuccesful,
      this.onDeleteFail,
    );
  }

  nullEvent() {
    const modal = $('#deleteModal');
    modal.modal('toggle');
    EventActions.updateEventState(null);
  }

  render() {
    const { eventState } = this.props;
    return (
      <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="title" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="container event-delete">
              <div ref={(input) => { this.confirm = input; }}>
                <h5>Delete event{eventState !== null ? ` "${this.props.eventState.name}"` : ''}?</h5>
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
    token: state.token,
    eventState: state.eventState,
  };
};

export default connect(mapStateToProps)(DeleteEvent);
