import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import EventActions from '../../actions/eventActions';
import DialApi from '../../DialApi';

/**
 * CenterEvents component class
 */
class CenterEvents extends React.Component {
  static propTypes = {
    id: Proptypes.number,
    events: Proptypes.array,
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
    this.noMoreEvents = false;
  }

  /**
   * executes before component mounts
   * @returns { void }
   */
  componentWillMount() {
    EventActions.updateEventsState([]);
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
      true,
      this.offset,
      this.limit,
      this.onLoadFail,
    );
  }

  /**
   * executes before component mounts
   * @returns { void }
   */
  componentWillUnmount() {
    EventActions.updateEventsState([]);
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
    }, 200);
  }

  /**
   * excecutes after fetching events
   * @returns { void }
   */
  onLoadFail() {
    if (this.offset > 0) this.offset -= this.increase;
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
        true,
        this.offset,
        this.limit,
      );
    }
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
    const { events } = this.props;
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
              <li className="list-group-item" key={event.id}>
                {
                  event.isAccepted === true ? (
                    event.start === event.end ?
                    event.start :
                    `${event.start} - ${event.end}`
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
  events: state.eventsState,
});

export default connect(mapStateToProps)(CenterEvents);
