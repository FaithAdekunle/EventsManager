import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import Helpers from '../../Helpers';
import OtherActions from '../../actions/others';
import CenterActions from '../../actions/centerActions';

/**
 * AdminHome component class
 */
class AdminHome extends React.Component {
  static propTypes = {
    centers: Proptypes.array,
    selectedImages: Proptypes.array,
    alert: Proptypes.string,
    token: Proptypes.string,
    history: Proptypes.object,
  }

  /**
   * constructor
   */
  constructor() {
    super();
    this.loaded = false;
    this.updateImages = this.updateImages.bind(this);
    this.submitCenter = this.submitCenter.bind(this);
    this.computeFacilities = this.computeFacilities.bind(this);
    this.updateFacilities = this.updateFacilities.bind(this);
    this.onCenterAddSuccessful = this.onCenterAddSuccessful.bind(this);
    this.onCenterAddFail = this.onCenterAddFail.bind(this);
    this.beforeLoad = this.beforeLoad.bind(this);
    this.load = this.load.bind(this);
    this.onLoadSuccessful = this.onLoadSuccessful.bind(this);
    this.facilities = {};
  }

  /**
   * executes after component mounts
   * @returns { void }
   */
  componentDidMount() {
    CenterActions.updateCenters(
      this.loader,
      this.beforeLoad,
      this.onLoadSuccessful,
      this.onLoadFail,
    );
  }

  /**
   * executes before component unmounts
   * @returns { void }
   */
  componentWillUnmount() {
    OtherActions.updateSelectedImages([]);
    OtherActions.updateAlertState(null);
    CenterActions.emptyCentersState();
  }

  /**
   * executes upon failed centers fetch
   * @returns { void }
   */
  onLoadFail() {
    return null;
  }

  /**
   * executes after centers have been fetched
   * @param { object } loader
   * @returns { void }
   */
  onLoadSuccessful(loader) {
    this.loaded = true;
    loader.style.width = '100%';
    setTimeout(() => {
      loader.classList.remove('success-background');
    }, 500);
  }

  /**
   * executes after a new center has been added succesfully
   * @param { object } center
   * @returns { void }
   */
  onCenterAddSuccessful(center) {
    CenterActions.addToCentersState(center);
    OtherActions.updateSelectedImages([]);
    OtherActions.updateAlertState(null);
    this.form.reset();
    this.facilities = {};
    this.fieldset.disabled = false;
  }

  /**
   * executes after attempt to add new center fails
   * @param { object } response
   * @returns { void }
   */
  onCenterAddFail(response) {
    this.fieldset.disabled = false;
    if (!response) {
      return OtherActions.updateAlertState('Looks like you\'re offline. Check internet connection.');
    }
    if (response.status === 401) {
      OtherActions.removeToken();
      return this.props.history.push('/signin');
    }
    return OtherActions.updateAlertState(response.data.error);
  }

  /**
   * excecutes before fetching centers
   * @param { object } loader
   * @returns { void }
   */
  beforeLoad(loader) {
    this.loaded = false;
    loader.classList.add('success-background');
    this.load(loader);
  }

  /**
   * displays loader bar
   * @param { object } loader
   * @param { integer } start
   * @param { integer } increase
   * @param { integer } interval
   * @returns { void }
   */
  load(loader, start = 0, increase = 2, interval = 50) {
    if (!this.loaded && start < 70) {
      start += increase;
      loader.style.width = `${start}%`;
      if (start === 50) {
        interval = 1000;
      }
      setTimeout(() => {
        this.load(loader, start, increase, interval);
      }, interval);
    }
  }

  /**
   * updates selectedImages state property with selected images
   * @returns { void }
   */
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

  /**
   * updates this.facilities
   * @param { object } e
   * @returns { void }
   */
  updateFacilities(e) {
    this.facilities[e.target.value] = e.target.checked;
  }

  /**
   * creates comma separated string of selected facilities
   * @returns { string } comma separated string of selected facilities
   */
  computeFacilities() {
    const keyValues = Object.entries(this.facilities);
    let facilities = '';
    keyValues.map((keyValue) => {
      if (keyValue[1]) facilities += `${facilities.length > 0 ? '###:###:###' : ''}${keyValue[0]}`;
      return null;
    });
    return facilities;
  }

  /**
   * adds new center
   * @param { object } e
   * @returns { void }
   */
  async submitCenter(e) {
    e.preventDefault();
    const facilities = this.computeFacilities();
    if (!facilities) return OtherActions.updateAlertState('select one or more facilities');
    this.fieldset.disabled = true;
    const { files } = this.images;
    let images = '';
    for (let i = 0; i < 4; i++) {
      if (files[i]) {
        const formData = new FormData();
        formData.append('upload_preset', Helpers.cloudinaryPreset);
        formData.append('file', files[i]);
        const response = await axios.post(Helpers.cloudinaryUrl, formData);
        images += `${images.length > 0 ? '###:###:###' : ''}${response.data.url}`;
      }
    }
    const credentials = {
      name: this.centerName.value,
      address: this.centerAddress.value,
      description: this.centerDescription.value,
      capacity: this.centerCapacity.value,
      cost: this.centerCost.value,
      facilities,
      images,
    };
    return CenterActions.addCenter(
      credentials,
      this.props.token,
      this.onCenterAddSuccessful,
      this.onCenterAddFail,
    );
  }

  /**
   * renders component in browser
   * @returns { component } to be rendered on the page
   */
  render() {
    const { selectedImages } = this.props;
    return (
      <React.Fragment>
        <div className="centers-loader success-background" ref={(input) => { this.loader = input; }} />
        <div className="container admin-page">
          <div className={`container ${!this.props.alert ? 'hidden' : ''}`}>
            <div className="alert alert-info" role="alert">
              <strong>{this.props.alert}</strong>
            </div>
          </div>
          <div className={`row ${this.props.centers ? '' : 'hidden'}`}>
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
                                <div className="col-md-6"><input ref={(input) => { this.centerCapacity = input; }} type="number" className="form-control" id="capacity" min="1" max="2147483647" required /></div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="form-group row">
                                <div className="col-md-3"><label htmlFor="cost" className="col-form-label">Cost</label></div>
                                <div className="col-md-9"><input ref={(input) => { this.centerCost = input; }} type="number" className="form-control" id="cost" min="1" max="2147483647" required /></div>
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
                                  Helpers.facilities.map((facility) => {
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
            <div className="col-md-4">
              <ul className="list-group centers-list">
                {
                  Helpers.sortByName(this.props.centers).map((center, index) => {
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
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    alert: state.alertState,
    token: state.token,
    centers: state.centersState,
    facilities: state.centerFacilities,
    selectedImages: state.selectedImages,
  };
};

export default connect(mapStateToProps)(AdminHome);
