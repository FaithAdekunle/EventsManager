import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';

class Event extends React.Component {
  static propTypes = {
    event: Proptypes.object,
    index: Proptypes.number,
    updateEventState: Proptypes.func,
  }

  openEditModal() {
    this.props.updateEventState({
      index: this.props.index,
      event: this.props.event,
    });
    const modal = $('#editModal');
    modal.modal({
      show: true,
      keyboard: false,
      backdrop: 'static',
    });
  }

  openDeleteModal() {
    this.props.updateEventState({
      index: this.props.index,
      event: this.props.event,
    });
    const modal = $('#deleteModal');
    modal.modal({
      show: true,
      keyboard: false,
      backdrop: 'static',
    });
  }

  render() {
    const { event } = this.props;
    return (
      <div>
        <div className="card">
          <div className="title">
            <div className="row">
              <div className="col-10">
                <h6>{event.name}</h6>
              </div>
              <div className="col-1">
                <a className="navTo" onClick={() => this.openEditModal()}><i className="fa fa-pencil navTo" aria-hidden="true" /></a>
              </div>
              <div className="col-1">
                <a className="navTo" onClick={() => this.openDeleteEvent()}><i className="fa fa-times navTo" aria-hidden="true" /></a>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6"><span className="text-muted">Type: <strong>{event.type}</strong></span></div>
            <div className="col-6"><span className="text-muted">Guests: <strong>{event.guests}</strong></span></div>
            <div className="col-6"><span className="text-muted">Start: <strong>{event.start}</strong></span></div>
            <div className="col-6"><span className="text-muted">End: <strong>{event.end}</strong></span></div>
          </div>
          <div className="venue"><span className="text-muted">Venue: </span><a className="navTo"><strong>{event.centerId}</strong></a></div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateEventState: (event) => {
      dispatch({
        type: 'UPDATE_EVENT_STATE',
        payload: event,
      });
    },
  };
};

export default connect(null, mapDispatchToProps)(Event);
