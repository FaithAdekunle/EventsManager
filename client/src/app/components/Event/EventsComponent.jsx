import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import EventCardComponent from './EventCardComponent.jsx';
import EditEventComponent from './EditEventComponent.jsx';
import DeleteEventComponent from './DeleteEventComponent.jsx';
import OtherActions from '../../actions/otherActions';
import EventActions from '../../actions/eventActions';
import DialApi from '../../DialApi';
import constants from '../../constants';

/**
 * Events component class
 */
export class EventsComponent extends React.Component {
  static propTypes = {
    history: Proptypes.object,
    events: Proptypes.array,
    alert: Proptypes.string,
    token: Proptypes.string,
  }

  /**
   * constructor
   */
  constructor() {
    super();
    this.offset = 0;
    this.limit = 10;
    this.totalCount = 0;
    this.onFetchEventsFail = this.onFetchEventsFail.bind(this);
    this.onFetchEventsSuccessful = this.onFetchEventsSuccessful.bind(this);
    this.loadNext = this.loadNext.bind(this);
    this.onDeleteEvent = this.onDeleteEvent.bind(this);
  }

  /**
   * executes after component mounts
   * @returns { void }
   */
  componentDidMount() {
    scrollTo(0, 0);
    window.addEventListener('scroll', this.loadNext, false);
    OtherActions.setAlert('loading');
    DialApi
      .updateEvents(
        this.props.token,
        this.onFetchEventsSuccessful,
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
    OtherActions.setAlert(null);
    OtherActions.setPagination(null);
    EventActions.setEvents([]);
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
        .setAlert(constants.NO_CONNECTION);
    }
    if ([401, 404].includes(response.status)) {
      OtherActions.removeToken();
      return this.props.history.push('/signin');
    }
    return OtherActions.setAlert(response.data.error);
  }

  /**
   * executes after attempt to fetch events fail
   * @param { object } data
   * @returns { void }
   */
  onFetchEventsSuccessful(data) {
    OtherActions.setAlert(null);
    this.totalCount = data.metaData.pagination.totalCount;
    EventActions.addToEvents(data.events);
  }

  /**
   * executes after an event has been deleted
   * @returns { void }
   */
  onDeleteEvent() {
    this.totalCount -= 1;
  }

  /**
   * displays loader bar
   * @returns { void }
   */
  loadNext() {
    const pos = window.innerHeight + window.scrollY;
    if (pos - 60 === document.body.offsetHeight &&
    this.props.events.length < this.totalCount) {
      this.offset += this.limit;
      OtherActions.setAlert('loading');
      DialApi
        .updateEvents(
          this.props.token,
          this.onFetchEventsSuccessful,
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
    const { events } = this.props;
    return (
      <div className="container">
        <div className="events-container">
          <div className="row event-items">
            <div className="col-lg-10 offset-lg-1">
              <div className="row my-events">
                <div className="col-8 events-count">
                  <h5>
                      My Events {this.props.alert === 'loading' ?
                      spinner : ''}
                  </h5>
                </div>
              </div>
              <div
                className={this.props.alert === constants.NO_CONNECTION ?
                '' : 'hidden'}
              >
                <div className="alert alert-info" role="alert">
                  <strong>{this.props.alert}</strong>
                </div>
              </div>
              <div
                className={`${this.props.events.length === 0 &&
                this.props.alert === null ? '' : 'hidden'}`}
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
                {this.props.events.map(event => (
                  <div className="col-md-6" key={event.id}>
                    <EventCardComponent
                      event={event}
                      history={this.props.history}
                    />
                  </div>
                  ))}
              </div>
              <div className="text-center">
                {
                  this.props.alert === 'loading' && events.length ?
                    <h6 className="bottom-loader">loading...</h6> : ''
                }
              </div>
            </div>
          </div>
        </div>
        <EditEventComponent history={this.props.history} />
        <DeleteEventComponent
          history={this.props.history}
          onDeleteEvent={this.onDeleteEvent}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.token,
  events: state.events,
  alert: state.alert,
});

export default connect(mapStateToProps)(EventsComponent);

