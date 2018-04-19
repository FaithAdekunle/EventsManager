import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import Event from './EventComponent.jsx';
import EditEvent from './EditEventComponent.jsx';
import DeleteEvent from './DeleteEventComponent.jsx';
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
  }

  /**
   * executes after component mounts
   * @returns { void }
   */
  componentDidMount() {
    EventActions
      .updateEvents(this.props.token, this.onFetchEventsFail);
  }

  /**
   * executes before component unmounts
   * @returns { void }
   */
  componentWillUnmount() {
    $('#editModal').modal('hide');
    $('#deleteModal').modal('hide');
    OtherActions.updateAlertState(null);
  }

  /**
   * executes after attempt to fetch events fail
   * @param { object } response
   * @returns { void }
   */
  onFetchEventsFail(response) {
    if ([401, 404].includes(response.status)) {
      localStorage.removeItem('eventsManager');
      return this.props.history.push('/signin');
    }
    return OtherActions.updateAlertState(response.data.error);
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
                <h5>
                    My Events | {this.props.alertState === 'loading' ? spinner :
                      this.props.eventsState.length}
                </h5>
              </div>
            </div>
            <div
              className={this.props.alertState &&
                 this.props.alertState !== 'loading' ?
              '' : 'hidden'}
            >
              <div className="alert alert-info" role="alert">
                <strong>{this.props.alertState}</strong>
              </div>
            </div>
            <div
              className={`${this.props.eventsState.length === 0 &&
               this.props.alertState === null ? '' : 'hidden'}`}
            >
              <h5>
                You have no registered events yet. Visit
                <a
                  className="navTo redirect-to"
                  onClick={() => this.props.history.push('/centers')}
                >
                  centers
                </a>
                  page.
              </h5>
            </div>
            <div className="row">
              {this.props.eventsState.map(event => (
                <div className="col-md-6" key={event.id}>
                  <Event
                    event={event}
                    history={this.props.history}
                  />
                </div>
                ))}
            </div>
          </div>
        </div>
        <EditEvent history={this.props.history} />
        <DeleteEvent history={this.props.history} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.token,
  eventsState: state.eventsState,
  alertState: state.alertState,
});

export default connect(mapStateToProps)(Events);

