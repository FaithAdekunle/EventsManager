import React from 'react';
import Proptypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import Helpers from '../../Helpers';

class CenterDetails extends React.Component {
  static propTypes = {
    center: Proptypes.object,
    history: Proptypes.object,
    alert: Proptypes.string,
    centerTypes: Proptypes.array,
    match: Proptypes.object,
    updateCenterState: Proptypes.func,
    updateAlertState: Proptypes.func,
  }

  constructor() {
    super();
    this.submitEvent = this.submitEvent.bind(this);
  }

  componentDidMount() {
    this.props.updateCenterState(null);
    let loaded = false;
    const { id } = this.props.match.params;
    const load = (start = 0, increase = 2, interval = 50) => {
      if (!loaded && start < 70) {
        start += increase;
        this.loader.style.width = `${start}%`;
        if (start === 50) {
          interval = 1000;
        }
        setTimeout(() => {
          load(start, increase, interval);
        }, interval);
      }
    };
    load();
    axios
      .get(`${Helpers.localHost}/centers/${id}`)
      .then((response) => {
        loaded = true;
        this.loader.style.width = '100%';
        this.props.updateCenterState(response.data);
        setTimeout(() => { this.loader.classList.remove('success-background'); }, 500);
      })
      .catch((err) => {
        if (err.response) {
          loaded = true;
          this.loader.style.width = '100%';
          this.props.updateAlertState(err.response.data.err);
          setTimeout(() => {
            this.loader.classList.remove('success-background');
          }, 500);
        } else {
          this.props.updateAlertState('Looks like you\'re offline. Check internet connection.');
        }
      });
  }

  componentWillUnmount() {
    this.props.updateAlertState(null);
    this.props.updateCenterState(null);
  }

  closeSubmitModal() {
    const submitModal = $('#submitModal');
    submitModal.modal('toggle');
  }

  submitEvent(event) {
    event.preventDefault();
    const { appToken } = JSON.parse(localStorage.getItem('eventsManager'));
    const credentials = {
      name: this.eventName.value,
      type: this.eventType.value,
      guests: this.eventGuests.value,
      days: this.eventDays.value,
      start: Helpers.changeDateFormat(this.eventDate.value),
      centerId: this.props.center.id,
    };
    this.fieldset.disabled = true;
    axios
      .post(`${Helpers.localHost}/events?token=${appToken}`, credentials)
      .then(() => {
        this.closeSubmitModal();
        this.props.history.push('/events');
      })
      .catch((err) => {
        if ([401, 404].includes(err.response.status)) {
          localStorage.removeItem('eventsManager');
          return this.props.history.push('/signin');
        }
        this.fieldset.disabled = false;
        return window.alert(err.response ? (Array.isArray(err.response.data.err) ?
          err.response.data.err[0] : err.response.data.err) : 'Looks like you\'re offline. Check internet connection.');
      });
  }

  render() {
    const { centerTypes } = this.props;
    const { center } = this.props;
    const { alert } = this.props;
    const storage = localStorage.getItem('eventsManager');
    const canBookCenter = storage && !((JSON.parse(storage)).loginState.userIsAdmin);
    return (
      <div className="center-detail-page">
        <div className={`center-loader success-background ${center ? 'hidden' : ''}`} ref={(input) => { this.loader = input; }} />
        <div className={`container ${alert ? '' : 'hidden'} alert alert-info`} role="alert">
          {alert}
        </div>
        {
          center ? (
            <React.Fragment>
              <React.Fragment>
                <div id="center-image-controls" className="carousel slide" data-ride="carousel">
                  <div className="carousel-inner">
                    {
                      center.images.map((image, index) => {
                      return (
                        <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={image}><img src={image} alt="" className="d-block w-100" /></div>
                      );
                      })
                    }
                  </div>
                  <a className="carousel-control-prev" href="#center-image-controls" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                    <span className="sr-only">Previous</span>
                  </a>
                  <a className="carousel-control-next" href="#center-image-controls" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true" />
                    <span className="sr-only text-black">Next</span>
                  </a>
                </div>
                <h3 className="text-center center-detail-name">{center.name}</h3>
                <div className="center-details">
                  <p className="text-justify center-description">{center.description}</p>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="text-primary text-center">Facilities</div>
                      <table className="table table-bordered">
                        <tbody>
                          {
                            center.facilities.map((facility, index) => {
                              return index === 0 || index % 3 === 0 ? (
                                <tr key={facility}>
                                  <td>{facility}</td>
                                  {
                                    [1, 2].map((num) => {
                                      return center.facilities[index + num] ? (
                                        <td key={center.facilities[index + num]}>
                                          {center.facilities[index + num]}
                                        </td>
                                      ) : (
                                        <td key={num} />
                                      );
                                    })
                                  }
                                </tr>
                              ) : null;
                            })
                          }
                        </tbody>
                      </table>
                      {
                        canBookCenter ? (
                          <React.Fragment>
                            <hr />
                            <button type="button" className="btn btn-primary btn-lg btn-block see-more" data-toggle="modal" data-target="#submitModal">
                            Book this center
                            </button>
                          </React.Fragment>
                        ) : null
                      }
                    </div>
                    <div className="col-md-2 col-6">
                      <div className="text-primary text-center">Details</div>
                      <ul className="list-group">
                        <li className="list-group-item"><i className="fa fa-map-marker" aria-hidden="true" /><span>{center ? ` ${center.address}` : ''}</span></li>
                        <li className="list-group-item"><i className="fa fa-users" aria-hidden="true" /><span>{center ? ` ${center.capacity}` : ''}</span></li>
                        <li className="list-group-item"><i className="fa fa-money" aria-hidden="true" /><span>{center ? ` ${center.cost}` : ''}</span></li>
                      </ul>
                    </div>
                    <div className="col-md-4 col-6">
                      <div className="text-primary text-center">Booked dates</div>
                      <ul className="list-group">
                        <li className={`text-center list-group-item ${center.events.length === 0 ? '' : 'hidden'}`}>no booked dates</li>
                        {
                          Helpers.sortByDate(center.events).map((event) => {
                            return (
                              <li className="list-group-item" key={event.id}>
                                {
                                  event.start === event.end ? event.start : `${event.start} - ${event.end}`
                                }
                              </li>
                            );
                          })
                        }
                      </ul>
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
                          <h4 className="modal-title text-center">{center.name}</h4>
                          <button type="button" className="close" data-dismiss="modal">&times;</button>
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
                                <label htmlFor="name" className="col-form-label">Name</label>
                                <input ref={(input) => { this.eventName = input; }} required type="text" className="form-control" id="name" />
                              </div>
                              <div className="row">
                                <div className="col-5">
                                  <div className="form-group">
                                    <label htmlFor="days" className="col-form-label">Days</label>
                                    <input ref={(input) => { this.eventDays = input; }} required type="number" className="form-control" id="days" />
                                  </div>
                                </div>
                                <div className="col-7">
                                  <div className="form-group">
                                    <label htmlFor="date" className="col-form-label">Start Date</label>
                                    <input ref={(input) => { this.eventDate = input; }} required type="date" className="form-control" id="date" />
                                  </div>
                                </div>
                              </div>
                              <div className="row last-row">
                                <div className="col-7">
                                  <div className="form-group">
                                    <label htmlFor="type" className="col-form-label">Event type</label>
                                    <select ref={(input) => { this.eventType = input; }} required id="type" className="custom-select form-control">
                                      {centerTypes.map((type) => {
                                        return (
                                          <option
                                            key={type}
                                            defaultValue={type}
                                          >{type}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                </div>
                                <div className="col-5">
                                  <div className="form-group">
                                    <label htmlFor="guests" className="col-form-label">Guests</label>
                                    <input ref={(input) => { this.eventGuests = input; }} required type="number" className="form-control" id="guests" />
                                  </div>
                                </div>
                              </div>
                              <button type="submit" className="btn btn-outline-primary btn-block">Book this venue</button>
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

const mapStateToProps = (state) => {
  return {
    center: state.centerState,
    alert: state.alertState,
    centerTypes: state.centerTypes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAlertState: (msg) => {
      dispatch({
        type: 'UPDATE_ALERT_STATE',
        payload: msg,
      });
    },
    updateCenterState: (center) => {
      dispatch({
        type: 'UPDATE_CENTER_STATE',
        payload: center,
      });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CenterDetails);

