import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import Event from './EventComponent.jsx';
import EditEvent from './EditEventComponent.jsx';
import DeleteEvent from './DeleteEventComponent.jsx';
import OtherActions from '../../actions/otherActions';
import EventActions from '../../actions/eventActions';
import DialApi from '../../DialApi';

/**
 * Events component class
 */
class Events extends React.Component {
  static propTypes = {
    history: Proptypes.object,
    eventsState: Proptypes.array,
    alertState: Proptypes.string,
    token: Proptypes.string,
    pagination: Proptypes.object,
  }

  /**
   * executes after attempt to fetch events fail
   * @param { object } data
   * @returns { void }
   */
  static onFetchEventsSuccessful(data) {
    OtherActions.updateAlertState(null);
    OtherActions.updatePagination(data.metaData.pagination);
    EventActions.addToEventsState(data.events);
  }

  /**
   * constructor
   */
  constructor() {
    super();
    this.offset = 0;
    this.limit = 10;
    this.onFetchEventsFail = this.onFetchEventsFail.bind(this);
    this.loadNext = this.loadNext.bind(this);
  }

  /**
   * executes after component mounts
   * @returns { void }
   */
  componentDidMount() {
    window.addEventListener('scroll', this.loadNext, false);
    OtherActions.updateAlertState('loading');
    DialApi
      .updateEvents(
        this.props.token,
        Events.onFetchEventsSuccessful,
        this.onFetchEventsFail,
        this.limit,
        this.offset,
      );
  }

  /**
   * executes before component unmounts
   * @returns { void }
   */
  componentWillUnmount() {
    window.removeEventListener('scroll', this.loadNext, false);
    $('#editModal').modal('hide');
    $('#deleteModal').modal('hide');
    OtherActions.updateAlertState(null);
    OtherActions.updatePagination(null);
    EventActions.updateEventsState([]);
  }

  /**
   * executes after attempt to fetch events fail
   * @param { object } response
   * @returns { void }
   */
  onFetchEventsFail(response) {
    if (this.offset >= this.limit) this.offset -= this.limit;
    if (!response) {
      return OtherActions
        .updateAlertState(`Looks like you're offline. 
        Check internet connection.`);
    }
    if ([401, 404].includes(response.status)) {
      OtherActions.removeToken();
      return this.props.history.push('/signin');
    }
    return OtherActions.updateAlertState(response.data.error);
  }

  /**
   * displays loader bar
   * @returns { void }
   */
  loadNext() {
    const pos = window.innerHeight + window.scrollY;
    if (pos - 60 === document.body.offsetHeight &&
    this.props.eventsState.length < this.props.pagination.totalCount) {
      this.offset += this.limit;
      OtherActions.updateAlertState('loading');
      DialApi
        .updateEvents(
          this.props.token,
          Events.onFetchEventsSuccessful,
          this.onFetchEventsFail,
          this.limit,
          this.offset,
        );
    }
  }

  /**
   * renders component in browser
   * @returns { component } to be rendered on the page
   */
  render() {
    const spinner = (
      <i className="fa fa-spinner fa-spin" aria-hidden="true" />
    );
    const { pagination, eventsState } = this.props;
    return (
      <div className="container">
        <div className="events-container">
          <div className="row event-items">
            <div className="col-lg-10 offset-lg-1">
              <div className="row my-events">
                <div className="col-8 events-count">
                  <h5>
                      My Events | {this.props.alertState === 'loading' ?
                      spinner : pagination ? pagination.totalCount : ''}
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
                  You have no registered events yet. Visit&nbsp;
                  <a
                    className="navTo redirect-to"
                    onClick={() => this.props.history.push('/centers')}
                  >
                    centers&nbsp;
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
              <div className="text-center">
                {
                  this.props.alertState === 'loading' && eventsState.length ?
                    <h6 className="bottom-loader">loading...</h6> : ''
                }
              </div>
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
  pagination: state.pagination,
});

export default connect(mapStateToProps)(Events);

