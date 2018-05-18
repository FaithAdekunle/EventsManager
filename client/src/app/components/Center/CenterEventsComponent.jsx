import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import EventActions from '../../actions/eventActions';
import OtherActions from '../../actions/otherActions';
import DialApi from '../../DialApi';
import constants from '../../constants';

/**
 * CenterEvents component class
 */
class CenterEventsComponent extends React.Component {
  static propTypes = {
    id: Proptypes.number,
    events: Proptypes.array,
    token: Proptypes.string,
    history: Proptypes.object,
  }

  /**
   * adds 'hover-date' class to target
   * @param { object } e
   * @param { boolean } eventCanBeDeclined
   * @returns { void }
   */
  static onMouseEnterDate(e, eventCanBeDeclined) {
    if (eventCanBeDeclined) e.target.classList.add('hover-date');
  }

  /**
   * removess 'hover-date' class from target
   * @param { object } e
   * @returns { void }
   */
  static onMouseLeaveDate(e) {
    e.target.classList.remove('hover-date');
  }

  /**
   * declines event
   * @param {object} event
   * @returns { void }
   */
  static onDeclineSuccessful(event) {
    EventActions.updateEvents(event);
  }

  /**
   * constructor
   */
  constructor() {
    super();
    this.offset = 0;
    this.limit = 10;
    this.increase = 10;
    this.loaded = false;
    this.load = this.load.bind(this);
    this.beforeLoad = this.beforeLoad.bind(this);
    this.onLoadSuccessful = this.onLoadSuccessful.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onLoadFail = this.onLoadFail.bind(this);
    this.declineEvent = this.declineEvent.bind(this);
    this.noMoreEvents = false;
  }

  /**
   * executes before component mounts
   * @returns { void }
   */
  componentWillMount() {
    EventActions.setEvents([]);
  }

  /**
   * executes after component mounts
   * @returns { void }
   */
  componentDidMount() {
    DialApi.updateCenterEvents(
      this.props.id,
      this.beforeLoad,
      this.onLoadSuccessful,
      this.onLoadFail,
      this.offset,
      this.limit,
    );
  }

  /**
   * executes before component mounts
   * @returns { void }
   */
  componentWillUnmount() {
    EventActions.setEvents([]);
  }

  /**
   * onScroll event handler
   * @param { array } events
   * @returns { void }
   */
  onLoadSuccessful(events) {
    this.loaded = true;
    if (events.length < this.limit) this.noMoreEvents = true;
    this.loader.style.width = '100%';
    setTimeout(() => {
      this.loader.classList.remove('success-background');
      OtherActions.setAlert(null);
      EventActions.addToEvents(events);
    }, 200);
  }

  /**
   * excecutes after fetching events
   * @param { object } response
   * @returns { void }
   */
  onLoadFail(response) {
    if (this.offset > 0) this.offset -= this.increase;
    if (!response) {
      OtherActions.setAlert(constants.NO_CONNECTION);
    }
  }

  /**
   * onScroll event handler
   * @param { object } e
   * @returns { void }
   */
  onScroll(e) {
    const list = e.target;
    if (list.scrollHeight - list.scrollTop === list.clientHeight &&
    !this.noMoreEvents) {
      this.offset += this.increase;
      DialApi.updateCenterEvents(
        this.props.id,
        this.beforeLoad,
        this.onLoadSuccessful,
        this.offset,
        this.limit,
      );
    }
  }

  /**
   * declines event
   * @param {object} response
   * @returns { void }
   */
  onDeclineFail(response) {
    if ([401, 404].includes(response.status)) {
      this.props.history.push('/signin');
    }
  }

  /**
   * declines event
   * @param {object} event
   * @returns { void }
   */
  declineEvent(event) {
    DialApi.declineEvent(
      this.props.token,
      event,
      CenterEventsComponent.onDeclineSuccessful,
      this.onDeclineFail,
    );
  }

  /**
   * displays loader bar
   * @param { integer } start
   * @param { integer } increase
   * @param { integer } interval
   * @returns { void }
   */
  load(start = 0, increase = 2, interval = 50) {
    if (!this.loaded && start < 80) {
      start += increase;
      this.loader.style.width = `${start}%`;
      if (start === 60) {
        interval = 1000;
      }
      setTimeout(() => {
        this.load(start, increase, interval);
      }, interval);
    }
  }

  /**
   * excecutes before fetching events
   * @returns { void }
   */
  beforeLoad() {
    this.loader.classList.add('success-background');
    this.loaded = false;
    this.load();
  }

  /**
   * renders component in browser
   * @returns { component } to be rendered on the page
   */
  render() {
    const { events, token } = this.props;
    let userIsAdmin = false;
    try {
      userIsAdmin = (jwtDecode(token)).isAdmin;
    } catch (error) {
      userIsAdmin = false;
    }
    return (
      <React.Fragment>
        <div
          className="center-loader success-background"
          ref={(input) => { this.loader = input; }}
        />
        <ul
          className="list-group booked-dates"
          onScroll={this.onScroll}
        >
          <li
            className={
              `text-center list-group-item 
              ${events.length === 0 ? '' : 'hidden'}`
            }
          >
            no booked dates
          </li>
          {
            events.map(event => (
              <li
                className={`${!event.isAccepted ?
                'declined' : ''} list-group-item`}
                onMouseEnter={e => CenterEventsComponent
                  .onMouseEnterDate(e, userIsAdmin && event.isAccepted)}
                onMouseLeave={CenterEventsComponent.onMouseLeaveDate}
                key={event.id}
              >
                {
                  event.start === event.end ?
                  event.start :
                  `${event.start} - ${event.end}`
                }
                {
                  userIsAdmin && event.isAccepted ? (
                    <i
                      className="fa fa-times pull-right"
                      aria-hidden="true"
                      onClick={() => this.declineEvent(event)}
                    />
                  ) : ''
                }
              </li>
              ))
          }
        </ul>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  events: state.events,
  token: state.token,
});

export default connect(mapStateToProps)(CenterEventsComponent);
