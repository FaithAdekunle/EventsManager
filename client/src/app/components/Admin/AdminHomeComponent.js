import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

class AdminHome extends React.Component {
  static propTypes = {
    centers: PropTypes.array,
    facilities: PropTypes.array,
    selectedImages: PropTypes.array,
    alert: PropTypes.string,
    history: PropTypes.object,
    updateCentersState: PropTypes.func,
    addToCentersState: PropTypes.func,
    updateAlertState: PropTypes.func,
    updateSelectedImages: PropTypes.func,
  }

  constructor() {
    super();
    this.updateImages = this.updateImages.bind(this);
    this.submitCenter = this.submitCenter.bind(this);
    this.computeFacilities = this.computeFacilities.bind(this);
    this.updateFacilities = this.updateFacilities.bind(this);
    this.facilities = {};
    this.cloudinaryPreset = 'axgrmj0a';
    this.cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dutglgwaa/upload';
  }

  componentDidMount() {
    let loaded = false;
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
      .get('http://localhost:7777/api/v1/centers')
      .then((response) => {
        loaded = true;
        this.loader.style.width = '100%';
        this.props.updateCentersState(response.data);
        setTimeout(() => { this.loader.classList.remove('success-background'); }, 500);
      })
      .catch(() => this.props.updateAlertState('Looks like you\'re offline. Check internet connection.'));
  }

  componentWillUnmount() {
    this.props.updateSelectedImages([]);
    this.props.updateAlertState(null);
  }

  updateImages() {
    let { files } = this.images;
    if (files.length > 4) files = [files[0], files[1], files[2], files[3]];
    const reader = new FileReader();
    const readFiles = (index = 0, selectedImages = []) => {
      if (index >= files.length) {
        return this.props.updateSelectedImages(selectedImages);
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

  updateFacilities(e) {
    this.facilities[e.target.value] = e.target.checked;
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

  async submitCenter(e) {
    e.preventDefault();
    this.fieldset.disabled = true;
    const { files } = this.images;
    let images = '';
    for (let i = 0; i < 4; i++) {
      if (files[i]) {
        const formData = new FormData();
        formData.append('upload_preset', this.cloudinaryPreset);
        formData.append('file', files[i]);
        const response = await axios.post(this.cloudinaryUrl, formData);
        images += `${images.length > 0 ? ', ' : ''}${response.data.url}`;
      }
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
    const eventsManager = JSON.parse(localStorage.getItem('eventsManager'));
    if (!eventsManager) return this.props.history.push('/signin');
    const { appToken } = eventsManager;
    return axios
      .post(`http://localhost:7777/api/v1/centers?token=${appToken}`, credentials)
      .then((response) => {
        this.props.addToCentersState(response.data);
        this.props.updateSelectedImages([]);
        this.props.updateAlertState(null);
        this.form.reset();
        this.facilities = {};
        this.fieldset.disabled = false;
      })
      .catch((err) => {
        this.fieldset.disabled = false;
        if (!err.response) this.props.updateAlertState('Looks like you\'re offline. Check internet connection.');
        else {
          localStorage.removeItem('eventsManager');
          this.props.updateAlertState(null);
          this.props.history.push('/signin');
        }
      });
  }

  render() {
    const { selectedImages } = this.props;
    return (
      <div>
        <div className="centers-loader success-background" ref={(input) => { this.loader = input; }} />
        <div className="container admin-page">
          <div className={`container ${!this.props.alert ? 'hidden' : ''}`}>
            <div className="alert alert-info" role="alert">
              <strong>{this.props.alert}</strong>
            </div>
          </div>
          <div className={`row ${this.props.centers ? '' : 'hidden'}`}>
            <div className="col-md-4">
              <ul className="list-group centers-list">
                {
                  this.props.centers.map((center, index) => {
                    return (
                      <li
                        className="list-group-item"
                        key={center.id}
                        onClick={() => this.props.history.push({
                        pathname: `admin/center/${center.id}`,
                        state: { index },
                      })}
                      >
                        {center ? center.name : ''}
                      </li>
                    );
                  })
                }
              </ul>
            </div>
            <div className="col-md-8">
              <div className="row">
                <div className="col-lg-10 offset-lg-1">
                  <div className="card">
                    <div className="card-header">
                      <h2>Add new center</h2>
                    </div>
                    <div className="card-body">
                      <fieldset ref={(input) => { this.fieldset = input; }}>
                        <form onSubmit={this.submitCenter} ref={(input) => { this.form = input; }}>
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
                              <input ref={(input) => { this.images = input; }} onChange={this.updateImages} id="images" type="file" className="form-control-file" multiple required />
                            </div>
                          </div>
                          <div className="row form-group">
                            <div className="col-md-3"><label htmlFor="name" className="col-form-label">Center Name</label></div>
                            <div className="col-md-9"><input ref={(input) => { this.centerName = input; }} type="text" className="form-control" id="name" required /></div>
                          </div>
                          <div className="row form-group">
                            <div className="col-md-3"><label htmlFor="address" className="col-form-label">Center Address</label></div>
                            <div className="col-md-9"><input ref={(input) => { this.centerAddress = input; }} type="text" className="form-control" id="address" required /></div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              <div className="form-group row">
                                <div className="col-md-6"><label htmlFor="capacity" className="col-form-label">Capacity</label></div>
                                <div className="col-md-6"><input ref={(input) => { this.centerCapacity = input; }} type="number" className="form-control" id="capacity" required /></div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="form-group row">
                                <div className="col-md-3"><label htmlFor="cost" className="col-form-label">Cost</label></div>
                                <div className="col-md-9"><input ref={(input) => { this.centerCost = input; }} type="number" className="form-control" id="cost" required /></div>
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="description" className="col-form-label">Center Description</label>
                            <textarea cols="30" rows="10" ref={(input) => { this.centerDescription = input; }} type="text" className="form-control" id="description" required />
                          </div>
                          <div className="row form-group">
                            <div className="col-md-3"><label htmlFor="facilities" className="col-form-label">Facilities</label></div>
                            <div className="col-md-9">
                              <div className="row">
                                {
                                  this.props.facilities.map((facility) => {
                                    return (
                                      <div className="col-6" key={facility}>
                                        <div className="form-check">
                                          <label className="form-check-label">
                                            <input type="checkbox" className="form-check-input" defaultValue={facility} onChange={this.updateFacilities} />
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
                            <input type="submit" className="btn btn-outline-primary" defaultValue="Add center" />
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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    centers: state.centersState,
    facilities: state.centerFacilities,
    selectedImages: state.selectedImages,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateLoginState: (loginState) => {
      dispatch({
        type: 'UPDATE_LOGIN_STATE',
        payload: loginState,
      });
    },
    updateUserState: (userState) => {
      dispatch({
        type: 'UPDATE_USER_STATE',
        payload: userState,
      });
    },
    updateAlertState: (msg) => {
      dispatch({
        type: 'UPDATE_ALERT_STATE',
        payload: msg,
      });
    },
    updateCentersState: (centers) => {
      dispatch({
        type: 'UPDATE_CENTERS_STATE',
        payload: centers,
      });
    },
    addToCentersState: (centers) => {
      dispatch({
        type: 'ADD_TO_CENTERS_STATE',
        payload: centers,
      });
    },
    updateSelectedImages: (images) => {
      dispatch({
        type: 'UPDATE_SELECTED_IMAGES',
        payload: images,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminHome);
