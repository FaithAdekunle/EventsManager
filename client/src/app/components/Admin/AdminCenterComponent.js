import React from 'react';
import Proptypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import Helpers from '../../Helpers';
import OtherActions from '../../actions/others';
import CenterActions from '../../actions/centerActions';
import EventActions from '../../actions/eventActions';

class AdminCenter extends React.Component {
  static propTypes = {
    center: Proptypes.object,
    match: Proptypes.object,
    history: Proptypes.object,
    selectedImages: Proptypes.array,
    alert: Proptypes.string,
    token: Proptypes.string,
  }

  constructor() {
    super();
    this.updateImages = this.updateImages.bind(this);
    this.submitCenter = this.submitCenter.bind(this);
    this.oncenterEditSuccessful = this.oncenterEditSuccessful.bind(this);
    this.onCenterEditFailed = this.onCenterEditFailed.bind(this);
    this.computeFacilities = this.computeFacilities.bind(this);
    this.updateFacilities = this.updateFacilities.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.facilities = {};
  }


  componentDidMount() {
    CenterActions.getCenter(this.loader, this.props.match.params.id, true);
  }

  componentWillUnmount() {
    OtherActions.updateAlertState(null);
    CenterActions.updateCenterState(null);
    OtherActions.updateSelectedImages([]);
  }

  onMouseEnterDate(e) {
    e.target.classList.add('hover-date');
  }

  onMouseLeaveDate(e) {
    e.target.classList.remove('hover-date');
  }

  oncenterEditSuccessful(response) {
    OtherActions.updateSelectedImages(response.data.images);
    CenterActions.updateCenterState(response.data);
    $('#detailsModal').modal('toggle');
    OtherActions.updateAlertState(null);
    this.form.reset();
    this.fieldset.disabled = false;
  }

  onCenterEditFailed(err) {
    this.fieldset.disabled = false;
    if (err.response.status === 401) {
      OtherActions.removeToken();
      $('#detailsModal').modal('toggle');
      return this.props.history.push('/signin');
    }
    if ([404, 409].includes(err.response.status)) return window.alert(err.response.data.err);
    return window.alert('Looks like you\'re offline. Check internet connection.');
  }

  closeModal() {
    this.images.value = null;
    OtherActions.updateSelectedImages(this.props.center.images);
  }

  updateFacilities(e) {
    this.facilities[e.target.value] = e.target.checked;
  }

  declineEvent(event, index, token) {
    EventActions.declineEvent(this.props.center, event.id, index, token);
  }

  computeFacilities() {
    const keyValues = Object.entries(this.facilities);
    let facilities = '';
    keyValues.map((keyValue) => {
      if (keyValue[1]) facilities += `${facilities.length > 0 ? ', ' : ''}${keyValue[0]}`;
      return null;
    });
    return facilities;
  }

  updateImages() {
    let { files } = this.images;
    if (files.length > 4) files = [files[0], files[1], files[2], files[3]];
    const reader = new FileReader();
    const readFiles = (index = 0, selectedImages = []) => {
      if (index >= files.length) {
        return OtherActions.updateSelectedImages(selectedImages);
      }
      reader.onloadend = (e) => {
        selectedImages.push(e.target.result);
        index++;
        readFiles(index, selectedImages);
      };
      return reader.readAsDataURL(files[index]);
    };
    return readFiles();
  }

  async submitCenter(e) {
    e.preventDefault();
    this.fieldset.disabled = true;
    const { files } = this.images;
    let images = '';
    if (files.length > 0) {
      for (let i = 0; i < 4; i++) {
        if (files[i]) {
          const formData = new FormData();
          formData.append('upload_preset', Helpers.cloudinaryPreset);
          formData.append('file', files[i]);
          const response = await axios.post(Helpers.cloudinaryUrl, formData);
          images += `${images.length > 0 ? ', ' : ''}${response.data.url}`;
        }
      }
    } else {
      images = this.props.center.images.join(',');
    }
    const credentials = {
      name: this.centerName.value,
      address: this.centerAddress.value,
      description: this.centerDescription.value,
      facilities: this.computeFacilities(),
      capacity: this.centerCapacity.value,
      cost: this.centerCost.value,
      images,
    };
    CenterActions.editCenter(
      credentials,
      this.props.token,
      this.props.match.params.id,
      this.oncenterEditSuccessful,
      this.onCenterEditFailed,
    );
  }

  render() {
    const {
      center,
      alert,
      selectedImages,
      token,
    } = this.props;
    return (
      <React.Fragment>
        <div className={`center-loader success-background ${center ? 'hidden' : ''}`} ref={(input) => { this.loader = input; }} />
        <React.Fragment>
          <div className={`container ${alert ? '' : 'hidden'} alert alert-info`} role="alert">
            {alert}
          </div>
          {
            center ? (
              <div className="center-detail-page">
                {
                  center.images.length > 0 ? (
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
                  ) : null
                }
                <h3 className="text-center center-detail-name">{center.name}</h3>
                <div className="center-details">
                  <div className="center-description admin-center-description">
                    <p className="text-justify">{center.description}</p>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="text-primary text-center">Details</div>
                          <ul className="list-group">
                            <li className="list-group-item"><i className="fa fa-map-marker" aria-hidden="true" /><span>{center.address}</span></li>
                            <li className="list-group-item"><i className="fa fa-users" aria-hidden="true" /><span>{center.capacity}</span></li>
                            <li className="list-group-item"><i className="fa fa-money" aria-hidden="true" /><span>{center.cost}</span></li>
                          </ul>
                        </div>
                        <div className="col-md-8">
                          <div className="text-primary text-center">Facilities</div>
                          <table className="table table-bordered">
                            <tbody>
                              {
                                center.facilities.map((facility, index) => {
                                  return index === 0 || index % 2 === 0 ? (
                                    <tr key={facility}>
                                      <td>{facility}</td>
                                      {
                                        center.facilities[index + 1] ? (
                                          <td>{center.facilities[index + 1]}</td>
                                        ) : null
                                      }
                                    </tr>
                                  ) : null;
                                })
                              }
                            </tbody>
                          </table>
                        </div>
                        <div className="container">
                          <button type="button" className="btn btn-primary btn-lg btn-block edit-center-btn" data-toggle="modal" data-target="#detailsModal">
                          Edit this center
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="text-primary text-center">Booked Dates</div>
                      <table className="table table-bordered">
                        <tbody>
                          {
                            center.events.map((event, index) => {
                              return index === 0 || index % 2 === 0 ? (
                                <tr key={event.id}>
                                  <td className={!event.isAccepted ? 'declined' : ''} onMouseEnter={this.onMouseEnterDate} onMouseLeave={this.onMouseLeaveDate}>{event.start === event.end ? event.start : `${event.start} - ${event.end}`}{ event.isAccepted ? (<i className="fa fa-times pull-right" aria-hidden="true" onClick={() => this.declineEvent(event, index, token)} />) : null}</td>
                                  {
                                    center.events[index + 1] ? (
                                      <td className={!center.events[index + 1].isAccepted ? 'declined' : ''} onMouseEnter={this.onMouseEnterDate} onMouseLeave={this.onMouseLeaveDate}>{center.events[index + 1].start === center.events[index + 1].end ? center.events[index + 1].start : `${center.events[index + 1].start} - ${center.events[index + 1].end}`}{center.events[index + 1].isAccepted ? (<i className="fa fa-times pull-right" aria-hidden="true" onClick={() => this.declineEvent(center.events[index + 1], index + 1, token)} />) : null}</td>
                                    ) : null
                                  }
                                </tr>
                              ) : null;
                            })
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="modal fade" id="detailsModal">
                  <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                      <div className="modal-body">
                        <div className="card">
                          <div className="card-header">
                            <h2>Edit Center<button type="button" className="pull-right close" data-dismiss="modal" onClick={this.closeModal}>&times;</button></h2>
                          </div>
                          <div className="card-body">
                            <fieldset ref={(input) => { this.fieldset = input; }}>
                              <form
                                onSubmit={this.submitCenter}
                                ref={(input) => { this.form = input; }}
                              >
                                <div className="row form-group">
                                  {
                                    selectedImages.map((image) => {
                                      return (
                                        <div className="col-3" key={image}><img src={image} alt="" className=" selected-image img-responsive" /></div>
                                      );
                                    })
                                  }
                                </div>
                                <div className="row form-group">
                                  <div className="col-md-3">
                                    <label htmlFor="images" className="col-form-label">Upload Images</label>
                                  </div>
                                  <div className="col-md-9">
                                    <input ref={(input) => { this.images = input; }} onChange={this.updateImages} id="images" type="file" className="form-control-file" multiple />
                                  </div>
                                </div>
                                <div className="row form-group">
                                  <div className="col-md-3"><label htmlFor="name" className="col-form-label">Center Name</label></div>
                                  <div className="col-md-9"><input ref={(input) => { this.centerName = input; }} type="text" className="form-control" id="name" defaultValue={center.name} required /></div>
                                </div>
                                <div className="row form-group">
                                  <div className="col-md-3"><label htmlFor="address" className="col-form-label">Center Address</label></div>
                                  <div className="col-md-9"><input ref={(input) => { this.centerAddress = input; }} type="text" className="form-control" id="address" defaultValue={center.address} required /></div>
                                </div>
                                <div className="row">
                                  <div className="col-6">
                                    <div className="form-group row">
                                      <div className="col-md-6"><label htmlFor="capacity" className="col-form-label">Capacity</label></div>
                                      <div className="col-md-6"><input ref={(input) => { this.centerCapacity = input; }} type="number" className="form-control" id="capacity" defaultValue={center.capacity} required /></div>
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="form-group row">
                                      <div className="col-md-3"><label htmlFor="cost" className="col-form-label">Cost</label></div>
                                      <div className="col-md-9"><input ref={(input) => { this.centerCost = input; }} type="number" className="form-control" id="cost" defaultValue={center.cost} required /></div>
                                    </div>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="description" className="col-form-label">Center Description</label>
                                  <textarea cols="30" rows="10" ref={(input) => { this.centerDescription = input; }} type="text" className="form-control" id="description" defaultValue={center.description} required />
                                </div>
                                <div className="row form-group">
                                  <div className="col-md-3"><label htmlFor="facilities" className="col-form-label">Facilities</label></div>
                                  <div className="col-md-9">
                                    <div className="row">
                                      {
                                        Helpers.facilities.map((facility) => {
                                        const checked = center.facilities.includes(facility);
                                          this.facilities[facility] = checked;
                                          return (
                                            <div className="col-6" key={facility}>
                                              <div className="form-check">
                                                <label className="form-check-label">
                                                  <input type="checkbox" className="form-check-input" defaultValue={facility} defaultChecked={checked} onChange={this.updateFacilities} />
                                                  {facility}
                                                </label>
                                              </div>
                                            </div>
                                          );
                                        })
                                      }
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <input type="submit" className="btn btn-outline-primary" defaultValue="Save Changes" />
                                </div>
                              </form>
                            </fieldset>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null
          }
        </React.Fragment>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token,
    center: state.centerState,
    alert: state.alertState,
    selectedImages: state.selectedImages,
  };
};

export default connect(mapStateToProps)(AdminCenter);
