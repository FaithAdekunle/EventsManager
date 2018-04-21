import React from 'react';
import Proptypes from 'prop-types';
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';
import Helpers from '../../Helpers';
import DialApi from '../../DialApi';
import OtherActions from '../../actions/otherActions';
import CenterActions from '../../actions/centerActions';
import EventActions from '../../actions/eventActions';
import CenterEvents from './CenterEvents.jsx';

/**
 * CenterDetails component class
 */
class CenterDetails extends React.Component {
  static propTypes = {
    center: Proptypes.object,
    history: Proptypes.object,
    alert: Proptypes.string,
    token: Proptypes.string,
    match: Proptypes.object,
  }

  /**
   * closes center booking modal
   * @returns { void }
   */
  static closeSubmitModal() {
    const submitModal = $('#submitModal');
    submitModal.modal('hide');
  }

  /**
   * constructor
   */
  constructor() {
    super();
    this.loaded = false;
    this.beforeCenterLoad = this.beforeCenterLoad.bind(this);
    this.load = this.load.bind(this);
    this.onCenterLoadSuccessful = this.onCenterLoadSuccessful.bind(this);
    this.submitEvent = this.submitEvent.bind(this);
    this.onEventSubmitSuccessful = this.onEventSubmitSuccessful.bind(this);
    this.onEventSubmitFail = this.onEventSubmitFail.bind(this);
  }

  /**
   * executes after component mounts
   * @returns { void }
   */
  componentDidMount() {
    DialApi.getCenter(
      this.props.match.params.id,
      this.beforeCenterLoad,
      this.onCenterLoadSuccessful,
    );
  }

  /**
   * executes before component unmounts
   * @returns { void }
   */
  componentWillUnmount() {
    CenterDetails.closeSubmitModal();
    OtherActions.updateAlertState(null);
    CenterActions.updateCenterState(null);
  }

  /**
   * executes after center has been booked successfully
   * @param { object } response
   * @returns { void }
   */
  onEventSubmitSuccessful() {
    CenterDetails.closeSubmitModal();
    this.props.history.push('/events');
  }

  /**
   * executes after attempt to book center fails
   * @param { object } response
   * @returns { void }
   */
  onEventSubmitFail(response) {
    if (!response) {
      this.fieldset.disabled = false;
      return alert('Looks like you\'re offline. Check internet connection.');
    }
    if ([401, 404].includes(response.status)) {
      localStorage.removeItem('eventsManager');
      return this.props.history.push('/signin');
    }
    this.fieldset.disabled = false;
    return window.alert(Array.isArray(response.data.error) ?
      response.data.error[0] : response.data.error);
  }

  /**
   * executes after centers have been fetched
   * @param { object } loader
   * @returns { void }
   */
  onCenterLoadSuccessful() {
    this.loaded = true;
    this.loader.style.width = '100%';
    setTimeout(() => {
      this.loader.classList.remove('success-background');
    }, 500);
  }

  /**
   * bookss center
   * @param { object } event
   * @returns { void }
   */
  submitEvent(event) {
    event.preventDefault();
    this.fieldset.disabled = true;
    const credentials = {
      name: this.eventName.value,
      type: this.eventType.value,
      guests: this.eventGuests.value,
      days: this.eventDays.value,
      start: Helpers.changeDateFormat(this.eventDate.value),
      centerId: this.props.center.id,
    };
    EventActions.addEvent(
      credentials,
      this.props.token,
      this.onEventSubmitSuccessful,
      this.onEventSubmitFail,
    );
  }

  /**
   * excecutes before fetching centers
   * @returns { void }
   */
  beforeCenterLoad() {
    this.loaded = false;
    this.loader.classList.add('success-background');
    this.load();
  }

  /**
   * displays loader bar
   * @param { integer } start
   * @param { integer } increase
   * @param { integer } interval
   * @returns { void }
   */
  load(start = 0, increase = 2, interval = 50) {
    if (!this.loaded && start < 70) {
      start += increase;
      this.loader.style.width = `${start}%`;
      if (start === 50) {
        interval = 1000;
      }
      setTimeout(() => {
        this.load(start, increase, interval);
      }, interval);
    }
  }

  /**
   * renders component in browser
   * @returns { component } to be rendered on the page
   */
  render() {
    const {
      center,
      alert,
      token,
    } = this.props;
    let userIsAdmin = false;
    try {
      userIsAdmin = (jwtDecode(token)).isAdmin;
    } catch (error) {
      userIsAdmin = false;
    }
    const canBookCenter = token && !userIsAdmin;
    return (
      <div className="center-detail-page">
        <div
          className={
            `center-loader success-background ${center ? 'hidden' : ''}`
          }
          ref={(input) => { this.loader = input; }}
        />
        <div
          className={`container ${alert ? '' : 'hidden'} alert alert-info`}
          role="alert"
        >
          {alert}
        </div>
        {
          center ? (
            <React.Fragment>
              <React.Fragment>
                <div
                  id="center-image-controls"
                  className="carousel slide"
                  data-ride="carousel"
                >
                  <div className="carousel-inner">
                    {
                      center.images.map((image, index) => (
                        <div
                          className={
                            `carousel-item ${index === 0 ? 'active' : ''}`
                          }
                          key={image}
                        >
                          <img src={image} alt="" className="d-block w-100" />
                        </div>
                      ))
                    }
                  </div>
                  <a
                    className="carousel-control-prev"
                    href="#center-image-controls"
                    role="button"
                    data-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Previous</span>
                  </a>
                  <a
                    className="carousel-control-next"
                    href="#center-image-controls"
                    role="button"
                    data-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    />
                    <span className="sr-only text-black">Next</span>
                  </a>
                </div>
                <h3 className="text-center center-detail-name">
                  {center.name}
                </h3>
                <div className="center-details">
                  <p className="text-justify center-description">
                    {center.description}
                  </p>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="text-primary text-center">Facilities</div>
                      <table className="table table-bordered">
                        <tbody>
                          {
                            center.facilities.map((facility, index) =>
                              (index === 0 || index % 3 === 0 ? (
                                <tr key={facility}>
                                  <td>{facility}</td>
                                  {
                                    [1, 2].map(num =>
                                      (center.facilities[index + num] ? (
                                        <td
                                          key={center.facilities[index + num]}
                                        >
                                          {center.facilities[index + num]}
                                        </td>
                                      ) : (
                                        <td key={num} />
                                      )))
                                  }
                                </tr>
                              ) : null))
                          }
                        </tbody>
                      </table>
                      {
                        canBookCenter ? (
                          <React.Fragment>
                            <hr />
                            <button
                              type="button"
                              className="btn btn-primary btn-lg
                              btn-block see-more"
                              data-toggle="modal"
                              data-target="#submitModal"
                            >
                            Book this center
                            </button>
                          </React.Fragment>
                        ) : null
                      }
                    </div>
                    <div className="col-md-2 col-6">
                      <div className="text-primary text-center">Details</div>
                      <ul className="list-group">
                        <li className="list-group-item">
                          <i className="fa fa-map-marker" aria-hidden="true" />
                          <span>{center ? ` ${center.address}` : ''}</span>
                        </li>
                        <li className="list-group-item">
                          <i className="fa fa-users" aria-hidden="true" />
                          <span>{center ? ` ${center.capacity}` : ''}</span>
                        </li>
                        <li className="list-group-item">
                          <i className="fa fa-money" aria-hidden="true" />
                          <span>{center ? ` ${center.cost}` : ''}</span>
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-4 col-6">
                      <div className="text-primary text-center">
                        Booked dates
                      </div>
                      <CenterEvents
                        id={parseInt(this.props.match.params.id, 10)}
                      />
                    </div>
                  </div>
                </div>
              </React.Fragment>
              {
                canBookCenter ? (
                  <div className="modal fade" id="submitModal">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h4 className="modal-title text-center">
                            {center.name}
                          </h4>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                          >
                            &times;
                          </button>
                        </div>
                        <div className="modal-body">
                          <fieldset
                            ref={(input) => { this.fieldset = input; }}
                          >
                            <form
                              ref={(input) => { this.form = input; }}
                              onSubmit={this.submitEvent}
                            >
                              <div className="form-group">
                                <label
                                  htmlFor="name"
                                  className="col-form-label"
                                >
                                  Name
                                </label>
                                <input
                                  ref={(input) => { this.eventName = input; }}
                                  required
                                  type="text"
                                  className="form-control"
                                  id="name"
                                />
                              </div>
                              <div className="row">
                                <div className="col-5">
                                  <div className="form-group">
                                    <label
                                      htmlFor="days"
                                      className="col-form-label"
                                    >
                                      Days
                                    </label>
                                    <input
                                      ref={(input) => {
                                        this.eventDays = input;
                                      }}
                                      required
                                      type="number"
                                      className="form-control"
                                      id="days"
                                      min="1"
                                      max="2147483647"
                                    />
                                  </div>
                                </div>
                                <div className="col-7">
                                  <div className="form-group">
                                    <label
                                      htmlFor="date"
                                      className="col-form-label"
                                    >
                                      Start Date
                                    </label>
                                    <input
                                      ref={(input) => {
                                        this.eventDate = input;
                                      }}
                                      required
                                      type="date"
                                      className="form-control"
                                      id="date"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="row last-row">
                                <div className="col-7">
                                  <div className="form-group">
                                    <label
                                      htmlFor="type"
                                      className="col-form-label"
                                    >
                                      Event type
                                    </label>
                                    <select
                                      ref={(input) => {
                                        this.eventType = input;
                                      }}
                                      required
                                      id="type"
                                      className="custom-select form-control"
                                    >
                                      {Helpers.centerTypes.map(type => (
                                        <option
                                          key={type}
                                          defaultValue={type}
                                        >{type}
                                        </option>
                                        ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="col-5">
                                  <div className="form-group">
                                    <label
                                      htmlFor="guests"
                                      className="col-form-label"
                                    >
                                      Guests
                                    </label>
                                    <input
                                      ref={(input) => {
                                        this.eventGuests = input;
                                        }}
                                      required
                                      type="number"
                                      className="form-control"
                                      id="guests"
                                      min="0"
                                      max={center.capacity}
                                    />
                                  </div>
                                </div>
                              </div>
                              <button
                                type="submit"
                                className="btn btn-outline-primary btn-block"
                              >
                                Book this venue
                              </button>
                            </form>
                          </fieldset>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null
              }
            </React.Fragment>
          ) : null
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.token,
  center: state.centerState,
  alert: state.alertState,
});
export default connect(mapStateToProps)(CenterDetails);

