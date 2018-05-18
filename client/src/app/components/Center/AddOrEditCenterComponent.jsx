import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import Helpers from '../../Helpers';
import OtherActions from '../../actions/otherActions';
import CenterActions from '../../actions/centerActions';
import constants from '../../constants';
import DialApi from '../../DialApi';

/**
 * AddOrEditCenter component class
 */
class AddOrEditCenter extends React.Component {
  static propTypes = {
    center: Proptypes.object,
    history: Proptypes.object,
    alert: Proptypes.string,
    token: Proptypes.string,
    images: Proptypes.array,
    onCenterAdded: Proptypes.func,
  }

  /**
   * constructor
   */
  constructor() {
    super();
    this.facilities = {};
    this.onSuccessful = this.onSuccessful.bind(this);
    this.onFail = this.onFail.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.submitCenter = this.submitCenter.bind(this);
    this.updateFacilities = this.updateFacilities.bind(this);
    this.updateImages = this.updateImages.bind(this);
    this.computeFacilities = this.computeFacilities.bind(this);
  }

  /**
   * executes after component mounts
   * @returns { void }
   */
  componentDidMount() {
    if (this.props.center) {
      OtherActions.setImages(this.props.center.images);
    }
  }

  /**
   * executes before component unmounts
   * @returns { void }
   */
  componentWillUnmount() {
    this.closeModal();
  }

  /**
   * executes after a new center has been added or edited succesfully
   * @param { object } center
   * @returns { void }
   */
  onSuccessful(center) {
    if (center) {
      CenterActions.setCenter(center);
    } else {
      this.props.onCenterAdded();
    }
    this.closeModal();
  }

  /**
   * executes after attempt to add or edit center fails
   * @param { object } response
   * @returns { void }
   */
  onFail(response) {
    this.fieldset.disabled = false;
    if (!response) {
      return OtherActions
        .setAlert(constants.NO_CONNECTION);
    }
    if ([401, 404].includes(response.status)) {
      OtherActions.removeToken();
      return this.props.history.push('/signin');
    }
    return OtherActions.setAlert(Array.isArray(response.data.error) ?
      response.data.error[0] : response.data.error);
  }

  /**
   * closes center modal
   * @param { boolean } reset
   * @returns { void }
   */
  closeModal() {
    const { NO_CONNECTION } = constants;
    if (this.props.alert !== NO_CONNECTION) OtherActions.setAlert(null);
    this.facilities = {};
    this.images.value = null;
    this.fieldset.disabled = false;
    OtherActions.setImages([]);
    if (this.props.center) {
      const { center } = this.props;
      this.centerName.value = center.name;
      this.centerAddress.value = center.address;
      this.centerDescription.value = center.description;
      this.centerCapacity.value = center.capacity;
      this.centerCost.value = center.cost;
      center.facilities.map((facility) => {
        this[facility].checked = true;
        this.facilities[facility] = true;
        return null;
      });
    } else {
      this.form.reset();
    }
    Helpers.facilities.map((facility) => {
      this[facility].addEventListener('change', this.updateFacilities);
      return null;
    });
    const modal = $('#centerModal');
    modal.modal('hide');
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
        return OtherActions.setImages(selectedImages);
      }
      reader.onloadend = (e) => {
        selectedImages.push(e.target.result);
        index += 1;
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
      if (keyValue[1]) {
        facilities += `${facilities.length > 0 ?
          '###:###:###' : ''}${keyValue[0]}`;
      }
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
    if (!facilities) {
      return OtherActions.setAlert('select one or more facilities');
    }
    const files = [...this.images.files];
    if (files.length === 0 && this.props.images.length === 0) {
      return OtherActions.setAlert('Choose one or more image(s)');
    }
    this.fieldset.disabled = true;
    let images = '';
    await Promise.all(files.map(async (file, index) => {
      if (index <= 3) {
        const formData = new FormData();
        formData.append('upload_preset', Helpers.cloudinaryPreset);
        formData.append('file', file);
        const response = await axios.post(Helpers.cloudinaryUrl, formData);
        const image = response.data.url;
        images += `${images.length > 0 ? '###:###:###' : ''}${image}`;
      }
    }));
    if (images.length === 0) {
      images = this.props.images.join('###:###:###');
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
    if (this.props.center) {
      return DialApi.editCenter(
        credentials,
        this.props.token,
        this.props.center.id,
        this.onSuccessful,
        this.onFail,
      );
    }
    return DialApi.addCenter(
      credentials,
      this.props.token,
      this.onSuccessful,
      this.onFail,
    );
  }


  /**
   * renders component in browser
   * @returns { component } to be rendered on the page
   */
  render() {
    const { center, alert, images } = this.props;
    return (
      <React.Fragment>
        <div
          className="modal fade"
          id="centerModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="title"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="title">
                  { center ? 'Edit Center' : 'Add Center'}
                  <i
                    className="fa fa-spinner fa-spin hidden"
                    ref={(input) => { this.spinner = input; }}
                    aria-hidden="true"
                  />
                </h5>
                <button
                  className="close"
                  type="button"
                  aria-label="Close"
                  onClick={this.closeModal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div
                className={alert ?
                      'form-error text-center' : 'no-visible'}
              >
                {alert}
              </div>
              <fieldset ref={(input) => { this.fieldset = input; }}>
                <form
                  ref={(input) => { this.form = input; }}
                  onSubmit={this.submitCenter}
                >
                  <div className="modal-body">
                    <div className="row form-group">
                      {
                        images.map(image => (
                          <div
                            className="col-3"
                            key={image}
                          >
                            <img
                              src={image}
                              alt=""
                              className="
                                selected-image img-responsive"
                            />
                          </div>
                          ))
                      }
                    </div>
                    <div className="row form-group">
                      <div className="col-md-3">
                        <label
                          htmlFor="images"
                          className="col-form-label"
                        >
                          Upload 1 - 4 Images
                        </label>
                      </div>
                      <div className="col-md-9">
                        <input
                          ref={(input) => { this.images = input; }}
                          onChange={this.updateImages}
                          id="images"
                          type="file"
                          className="form-control-file"
                          multiple
                        />
                      </div>
                    </div>
                    <div className="row form-group">
                      <div className="col-md-3">
                        <label
                          htmlFor="name"
                          className="col-form-label"
                        >
                          Center Name
                        </label>
                      </div>
                      <div className="col-md-9">
                        <input
                          ref={(input) => { this.centerName = input; }}
                          defaultValue={center ? center.name : ''}
                          type="text"
                          className="form-control"
                          id="name"
                          required
                        />
                      </div>
                    </div>
                    <div className="row form-group">
                      <div
                        className="col-md-3"
                      >
                        <label
                          htmlFor="address"
                          className="col-form-label"
                        >
                          Center Address
                        </label>
                      </div>
                      <div className="col-md-9">
                        <input
                          ref={(input) => { this.centerAddress = input; }}
                          defaultValue={center ? center.address : ''}
                          type="text"
                          className="form-control"
                          id="address"
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group row">
                          <div className="col-md-6">
                            <label
                              htmlFor="capacity"
                              className="col-form-label"
                            >
                              Capacity
                            </label>
                          </div>
                          <div className="col-md-6">
                            <input
                              ref={(input) => {
                                this.centerCapacity = input;
                              }}
                              defaultValue={center ? center.capacity : ''}
                              type="number"
                              className="form-control"
                              id="capacity"
                              min="1"
                              max="2147483647"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group row">
                          <div className="col-md-3">
                            <label
                              htmlFor="cost"
                              className="col-form-label"
                            >
                              Cost
                            </label>
                          </div>
                          <div className="col-md-9">
                            <input
                              ref={(input) => {
                                this.centerCost = input;
                              }}
                              defaultValue={center ? center.cost : ''}
                              type="number"
                              className="form-control"
                              id="cost"
                              min="1"
                              max="2147483647"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label
                        htmlFor="description"
                        className="col-form-label"
                      >
                        Center Description
                      </label>
                      <textarea
                        cols="30"
                        rows="10"
                        ref={(input) => {
                        this.centerDescription = input;
                        }}
                        defaultValue={center ? center.description : ''}
                        type="text"
                        className="form-control"
                        id="description"
                        required
                      />
                    </div>
                    <div className="row form-group">
                      <div className="col-md-3">
                        <label
                          htmlFor="facilities"
                          className="col-form-label"
                        >
                          Facilities
                        </label>
                      </div>
                      <div className="col-md-9">
                        <div className="row">
                          {
                            Helpers.facilities.map((facility) => {
                              if (center) {
                                if (center.facilities.includes(facility)) {
                                  this.facilities[facility] = true;
                                }
                              }
                              return (
                                <div className="col-6" key={facility}>
                                  <div className="form-check">
                                    <label
                                      className="form-check-label"
                                    >
                                      <input
                                        type="checkbox"
                                        ref={(input) => {
                                          this[facility] = input;
                                        }}
                                        className="form-check-input"
                                        defaultValue={facility}
                                        defaultChecked={center ? center
                                          .facilities
                                          .includes(facility) : false}
                                        onChange={this.updateFacilities}
                                      />
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
                      <input
                        type="submit"
                        className="btn btn-outline-primary"
                        defaultValue={center ? 'Edit Center' : 'Add Center'}
                      />
                    </div>
                  </div>
                </form>
              </fieldset>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  alert: state.alert,
  token: state.token,
  images: state.images,
});

export default connect(mapStateToProps)(AddOrEditCenter);
