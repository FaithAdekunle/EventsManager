import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import EventActions from '../../actions/eventActions';
import OtherActions from '../../actions/otherActions';
import DialApi from '../../DialApi';

/**
 * DeleteEvent component class
 */
class DeleteEventComponent extends React.Component {
  static propTypes = {
    token: Proptypes.string,
    eventState: Proptypes.object,
    history: Proptypes.object,
    onDeleteEvent: Proptypes.func,
  }

  /**
   * executes when edit modal closes or when event has been deleted
   * @returns { void }
   */
  static nullEvent() {
    const modal = $('#deleteModal');
    modal.modal('hide');
    EventActions.setEvent(null);
  }

  /**
   * constructor
   */
  constructor() {
    super();
    this.Component = this.deleteEvent.bind(this);
    this.onDeleteSuccesful = this.onDeleteSuccesful.bind(this);
    this.onDeleteFail = this.onDeleteFail.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
  }

  /**
   * executes after component updates
   * @returns { void }
   */
  componentDidUpdate() {
    const { eventState } = this.props;
    if (eventState && eventState.action === 'delete') {
      const modal = $('#deleteModal');
      modal.modal({
        show: true,
        keyboard: false,
        backdrop: 'static',
      });
    }
  }

  /**
   * executes before component unmounts
   * @returns { void }
   */
  componentWillUnmount() {
    DeleteEventComponent.nullEvent();
  }

  /**
   * executes after event has been deleted succesfully
   * @param { object } response
   * @returns { void }
   */
  onDeleteSuccesful() {
    EventActions.deleteFromEvents(this.props.eventState.event);
    this.confirm.classList.remove('hidden');
    this.deleting.classList.add('hidden');
    this.props.onDeleteEvent();
    DeleteEventComponent.nullEvent();
  }

  /**
   * executes after attempt to delete event fails
   * @param { object } response
   * @returns { void }
   */
  onDeleteFail(response) {
    this.confirm.classList.remove('hidden');
    this.deleting.classList.add('hidden');
    if (!response) {
      alert('Looks like you\'re offline. Check internet connection.');
      return DeleteEventComponent.nullEvent();
    }
    if ([401, 404].includes(response.status)) {
      OtherActions.removeToken();
      DeleteEventComponent.nullEvent();
      return this.props.history.push('/signin');
    }
    window.alert(response.data.error);
    return DeleteEventComponent.nullEvent();
  }

  /**
   * executes when edit modal closes or when event has been deleted
   * @returns { void }
   */
  deleteEvent() {
    this.confirm.classList.add('hidden');
    this.deleting.classList.remove('hidden');
    DialApi.deleteEvent(
      this.props.eventState.event.id,
      this.props.token,
      this.onDeleteSuccesful,
      this.onDeleteFail,
    );
  }

  /**
   * renders component in browser
   * @returns { component } to be rendered on the page
   */
  render() {
    const { eventState } = this.props;
    return (
      <div
        className="modal fade"
        id="deleteModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="title"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="container event-delete">
              <div ref={(input) => { this.confirm = input; }}>
                <h5>
                  Delete event{eventState !== null ?
                    ` "${this.props.eventState.event.name}"` : ''}?
                </h5>
                <div className="pull-right">
                  <button className="btn btn-danger" onClick={this.deleteEvent}>
                    Yes
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={DeleteEventComponent.nullEvent}
                  >
                    No
                  </button>
                </div>
              </div>
              <div
                className="hidden"
                ref={(input) => { this.deleting = input; }}
              >
                <h5 className="text-center">deleting...</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.token,
  eventState: state.event,
});

export default connect(mapStateToProps)(DeleteEventComponent);
