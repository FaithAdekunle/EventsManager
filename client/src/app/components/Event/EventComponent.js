import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';

/**
 * Event component class
 */
class Event extends React.Component {
  static propTypes = {
    event: Proptypes.object,
    history: Proptypes.object,
    centers: Proptypes.array,
    updateEventState: Proptypes.func,
  }

  /**
   * constructor
   */
  constructor() {
    super();
    this.getCenterName = this.getCenterName.bind(this);
    this.openDeleteModal = this.openDeleteModal.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.navToCenter = this.navToCenter.bind(this);
  }

  /**
   * gets center name using id
   * @returns { string } centerName
   */
  getCenterName() {
    let centerName = '';
    this.props.centers.map((center) => {
      if (center.id === this.props.event.centerId) centerName = center.name;
      return null;
    });
    return centerName;
  }

  /**
   * opens edit modal
   * @returns { void }
   */
  openEditModal() {
    if (this.props.event.isAccepted) {
      const modal = $('#editModal');
      modal.modal({
        show: true,
        keyboard: false,
        backdrop: 'static',
      });
      this.props.updateEventState(this.props.event);
    }
  }

  /**
   * opens delete modal
   * @returns { void }
   */
  openDeleteModal() {
    this.props.updateEventState(this.props.event);
    const modal = $('#deleteModal');
    modal.modal({
      show: true,
      keyboard: false,
      backdrop: 'static',
    });
  }

  /**
   * navigates to center page
   * @returns { void }
   */
  navToCenter() {
    this.props.history.push(`/centers/${this.props.event.center.id}`);
  }

  /**
   * renders component in browser
   * @returns { component } to be rendered on the page
   */
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
        <div className="venue"><span>Venue: </span><a className="navTo" onClick={this.navToCenter}><strong>{event.center.name}</strong></a></div>
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
    updateEventState: (event) => {
      dispatch({
        type: 'UPDATE_EVENT_STATE',
        payload: event,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Event);
