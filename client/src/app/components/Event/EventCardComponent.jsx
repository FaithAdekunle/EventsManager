import React from 'react';
import Proptypes from 'prop-types';
import EventActions from '../../actions/eventActions';

/**
 * Event component class
 */
class EventCardComponent extends React.Component {
  static propTypes = {
    event: Proptypes.object,
    history: Proptypes.object,
  }

  /**
   * constructor
   */
  constructor() {
    super();
    this.openDeleteModal = this.openDeleteModal.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.navToCenter = this.navToCenter.bind(this);
  }

  /**
   * opens edit modal
   * @returns { void }
   */
  openEditModal() {
    if (this.props.event.isAccepted) {
      EventActions.setEvent({
        action: 'edit',
        event: this.props.event,
      });
    }
  }

  /**
   * opens delete modal
   * @returns { void }
   */
  openDeleteModal() {
    EventActions.setEvent({
      action: 'delete',
      event: this.props.event,
    });
  }

  /**
   * navigates to center page
   * @returns { void }
   */
  navToCenter() {
    this.props.history.push(`/centers/${this.props.event.centerId}`);
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
            <a
              className="navTo"
              onClick={() => this.openEditModal()}
            >
              <i className="fa fa-pencil navTo" aria-hidden="true" />
            </a>
            <a
              className="navTo delete-event"
              onClick={() => this.openDeleteModal()}
            >
              <i className="fa fa-trash navTo" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="dropdown-divider divider" />
        <div className="row event-prop">
          <div className="col-6">
            <span>Type:&nbsp;
              <strong className="text-muted">{event.type}</strong>
            </span>
          </div>
          <div className="col-6">
            <span>Guests:&nbsp;
              <strong className="text-muted">
                {event.guests}
              </strong>
            </span>
          </div>
          <div className="col-6">
            <span>Start:&nbsp;
              <strong className="text-muted">
                {event.start}
              </strong>
            </span>
          </div>
          <div className="col-6">
            <span>End:&nbsp;
              <strong className="text-muted">
                {event.end}
              </strong>
            </span>
          </div>
        </div>
        <div className="venue">
          <span>Venue: </span>
          {
            event.center ? (
              <a className="navTo" onClick={this.navToCenter}>
                <strong>
                  {event.center.name}
                </strong>
              </a>
            ) : ''
          }
        </div>
      </div>
    );
  }
}

export default EventCardComponent;
