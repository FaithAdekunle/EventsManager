import React from 'react';
import Proptypes from 'prop-types';
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';
import Helpers from '../../Helpers';
import DialApi from '../../DialApi';
import OtherActions from '../../actions/otherActions';
import CenterActions from '../../actions/centerActions';
import CenterEventsComponent from './CenterEventsComponent.jsx';
import constants from '../../constants';
import AddOrEditCenterComponent from './AddOrEditCenterComponent.jsx';

/**
 * CenterDetails component class
 */
class CenterDetailsComponent extends React.Component {
  static propTypes = {
    center: Proptypes.object,
    history: Proptypes.object,
    alert: Proptypes.string,
    token: Proptypes.string,
    match: Proptypes.object,
  }

  /**
   * opens modal to book center
   * @returns { void }
   */
  static openSubmitModal() {
    const modal = $('#submitModal');
    modal.modal({
      show: true,
      keyboard: false,
      backdrop: 'static',
    });
  }

  /**
   * closes center booking modal
   * @returns { void }
   */
  static closeSubmitModal() {
    OtherActions.setAlert(null);
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
    this.onCenterLoadFail = this.onCenterLoadFail.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
  }

  /**
   * executes after component mounts
   * @returns { void }
   */
  componentDidMount() {
    window.scrollTo(0, 0);
    DialApi.getCenter(
      this.props.match.params.id,
      this.beforeCenterLoad,
      this.onCenterLoadSuccessful,
      this.onCenterLoadFail,
    );
  }

  /**
   * @param { object } prevProps
   * executes after component updates
   * @returns { void }
   */
  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      DialApi.getCenter(
        this.props.match.params.id,
        this.beforeCenterLoad,
        this.onCenterLoadSuccessful,
        this.onCenterLoadFail,
      );
    }
  }

  /**
   * executes before component unmounts
   * @returns { void }
   */
  componentWillUnmount() {
    CenterDetailsComponent.closeSubmitModal();
    OtherActions.setAlert(null);
    CenterActions.setCenter(null);
  }

  /**
   * executes after center has been booked successfully
   * @param { object } response
   * @returns { void }
   */
  onEventSubmitSuccessful() {
    CenterDetailsComponent.closeSubmitModal();
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
      return OtherActions
        .setAlert(`Looks like you're offline. 
        Check internet connection.`);
    }
    if ([401, 404].includes(response.status)) {
      OtherActions.removeToken();
      return this.props.history.push('/signin');
    }
    this.fieldset.disabled = false;
    return OtherActions.setAlert(Array.isArray(response.data.error) ?
      response.data.error[0] : response.data.error);
  }

  /**
   * executes after centers have been fetched
   * @param { object } data
   * @returns { void }
   */
  onCenterLoadSuccessful(data) {
    this.loaded = true;
    this.loader.style.width = '100%';
    setTimeout(() => {
      this.loader.classList.remove('success-background');
      CenterActions.setCenter(data.center);
    }, 500);
  }

  /**
   * executes after centers have been fetched
   * @param { object } response
   * @returns { void }
   */
  onCenterLoadFail(response) {
    this.loaded = true;
    this.loader.style.width = '100%';
    setTimeout(() => {
      this.loader.classList.remove('success-background');
      if (response) {
        OtherActions.setAlert(response.data.error);
      } else {
        OtherActions
          .setAlert(constants.NO_CONNECTION);
      }
    }, 500);
  }

  /**
   * opens modal to book center
   * @returns { void }
   */
  openEditModal() {
    OtherActions.setImages(this.props.center.images);
    const modal = $('#centerModal');
    modal.modal({
      show: true,
      keyboard: false,
      backdrop: 'static',
    });
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
      start: Helpers.changeDateFormat(this.eventStartDate.value),
      end: Helpers.changeDateFormat(this.eventEndDate.value),
      centerId: this.props.center.id,
    };
    DialApi.addEvent(
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
    CenterActions.setCenter(null);
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
    const canEditCenter = token && userIsAdmin;
    return (
      <div className="center-detail-page">
        <div className="detail-content">
          <div
            className={
              `center-loader margin-nav success-background ${center ?
                'hidden' : ''}`
            }
            ref={(input) => { this.loader = input; }}
          />
          <div
            className={`container alert alert-info
             ${(alert === constants.NO_CONNECTION ||
              alert === 'center not found') && !center ? '' : 'hidden'}`}
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
                        <div className="text-primary text-center">
                        Facilities
                        </div>
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
                                onClick={CenterDetailsComponent.openSubmitModal}
                              >
                              Book this center
                              </button>
                            </React.Fragment>
                          ) : null
                        }
                        {
                          canEditCenter ? (
                            <React.Fragment>
                              <hr />
                              <button
                                type="button"
                                className="btn btn-primary btn-lg
                                btn-block see-more"
                                onClick={this.openEditModal}
                              >
                              Edit this center
                              </button>
                              <AddOrEditCenterComponent
                                history={this.props.history}
                                center={center}
                              />
                            </React.Fragment>
                          ) : null
                        }
                      </div>
                      <div className="col-md-2 col-6">
                        <div className="text-primary text-center">Details</div>
                        <ul className="list-group">
                          <li className="list-group-item">
                            <i
                              className="fa fa-map-marker"
                              aria-hidden="true"
                            />
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
                        <CenterEventsComponent
                          id={parseInt(this.props.match.params.id, 10)}
                          history={this.props.history}
                        />
                      </div>
                    </div>
                  </div>
                </React.Fragment>
                {
                  canBookCenter ? (
                    <div className="modal fade" id="submitModal">
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h4 className="modal-title text-center">
                              {center.name}
                            </h4>
                            <button
                              type="button"
                              className="close"
                              onClick={CenterDetailsComponent.closeSubmitModal}
                              data-dismiss="modal"
                            >
                              &times;
                            </button>
                          </div>
                          <div
                            className={this.props.alert ?
                                'form-error text-center' : 'no-visible'}
                          >
                            {this.props.alert}
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
                                  <div className="col-6">
                                    <div className="form-group">
                                      <label
                                        htmlFor="start-date"
                                        className="col-form-label"
                                      >
                                        Start Date
                                      </label>
                                      <input
                                        ref={(input) => {
                                          this.eventStartDate = input;
                                        }}
                                        required
                                        type="date"
                                        className="form-control"
                                        id="start-date"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="form-group">
                                      <label
                                        htmlFor="end-date"
                                        className="col-form-label"
                                      >
                                        End Date
                                      </label>
                                      <input
                                        ref={(input) => {
                                          this.eventEndDate = input;
                                        }}
                                        required
                                        type="date"
                                        className="form-control"
                                        id="end-date"
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
                                  Book
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.token,
  center: state.center,
  alert: state.alert,
});
export default connect(mapStateToProps)(CenterDetailsComponent);
