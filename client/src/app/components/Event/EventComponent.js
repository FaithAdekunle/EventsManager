import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';

class Event extends React.Component {
  static propTypes = {
    event: Proptypes.object,
    history: Proptypes.object,
    centers: Proptypes.array,
    index: Proptypes.number,
    updateEventIndex: Proptypes.func,
  }

  constructor() {
    super();
    this.getCenterName = this.getCenterName.bind(this);
    this.openDeleteModal = this.openDeleteModal.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.navToCenter = this.navToCenter.bind(this);
  }

  getCenterName() {
    let centerName = '';
    this.props.centers.map((center) => {
      if (center.id === this.props.event.centerId) centerName = center.name;
      return null;
    });
    return centerName;
  }

  openEditModal() {
    if (this.props.event.isAccepted) {
      const modal = $('#editModal');
      modal.modal({
        show: true,
        keyboard: false,
        backdrop: 'static',
      });
      this.props.updateEventIndex(this.props.index);
    }
  }

  openDeleteModal() {
    this.props.updateEventIndex(this.props.index);
    const modal = $('#deleteModal');
    modal.modal({
      show: true,
      keyboard: false,
      backdrop: 'static',
    });
  }

  navToCenter() {
    this.props.history.push(`/centers/${this.props.event.centerId}`);
  }

  render() {
    const { event } = this.props;
    return (
      <div className="event card">
        <div className="event-title">
          <h6 className={!event.isAccepted ? 'declined' : ''}>{event.name}</h6>
          <div>
            <a className="navTo" onClick={() => this.openEditModal()}><i className="fa fa-pencil navTo" aria-hidden="true" /></a>
            <a className="navTo delete-event" onClick={() => this.openDeleteModal()}><i className="fa fa-times navTo" aria-hidden="true" /></a>
          </div>
        </div>
        <div className="dropdown-divider divider" />
        <div className="row event-prop">
          <div className="col-6"><span>Type: <strong className="text-muted">{event.type}</strong></span></div>
          <div className="col-6"><span>Guests: <strong className="text-muted">{event.guests}</strong></span></div>
          <div className="col-6"><span>Start: <strong className="text-muted">{event.start}</strong></span></div>
          <div className="col-6"><span>End: <strong className="text-muted">{event.end}</strong></span></div>
        </div>
        <div className="venue"><span>Venue: </span><a className="navTo" onClick={this.navToCenter}><strong>{this.getCenterName()}</strong></a></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    centers: state.centersState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateEventIndex: (event) => {
      dispatch({
        type: 'UPDATE_EVENT_INDEX',
        payload: event,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Event);
