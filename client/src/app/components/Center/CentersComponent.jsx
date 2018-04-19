import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import Center from './CenterComponent.jsx';
import OtherActions from '../../actions/otherActions';
import CenterActions from '../../actions/centerActions';

/**
 * Centers component class
 */
class Centers extends React.Component {
  static propTypes = {
    centers: Proptypes.array,
    alert: Proptypes.string,
    history: Proptypes.object,
  }

  /**
   * constructor
   */
  constructor() {
    super();
    this.offset = 0;
    this.limit = 3;
    this.increase = 3;
    this.filter = '';
    this.capacity = 1;
    this.facility = '';
    this.loaded = false;
    this.handleScroll = this.handleScroll.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onLoadFail = this.onLoadFail.bind(this);
    this.beforeLoad = this.beforeLoad.bind(this);
    this.load = this.load.bind(this);
    this.onLoadSuccessful = this.onLoadSuccessful.bind(this);
  }

  /**
   * executes after component mounts
   * @returns { void }
   */
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, false);
    CenterActions.updateCenters(
      this.mainLoader,
      this.beforeLoad,
      this.onLoadSuccessful,
      this.onLoadFail,
      this.offset,
      this.limit,
    );
  }

  /**
   * executes before component unmounts
   * @returns { void }
   */
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, false);
    OtherActions.updateAlertState(null);
    CenterActions.emptyCentersState();
  }

  /**
   * executes upon failed centers fetch
   * @returns { void }
   */
  onLoadFail() {
    if (this.offset > 0) this.offset -= this.increase;
    this.fieldset.disabled = false;
  }

  /**
   * executes after centers have been fetched
   * @param { object } loader
   * @returns { void }
   */
  onLoadSuccessful(loader) {
    this.loaded = true;
    this.fieldset.disabled = false;
    loader.style.width = '100%';
    setTimeout(() => {
      loader.classList.remove('success-background');
    }, 500);
  }

  /**
   * submits the filter form
   * @param { object } e
   * @returns { void }
   */
  onSubmit(e) {
    e.preventDefault();
    this.filter = this.filterField.value || '';
    this.capacity = this.capacityField.value || 1;
    this.facility = this.facilityField.value || '';
    this.offset = 0;
    CenterActions.emptyCentersState();
    CenterActions.updateCenters(
      this.mainLoader,
      this.beforeLoad,
      this.onLoadSuccessful,
      this.onLoadFail,
      this.offset,
      this.limit,
      this.filter,
      this.facility,
      this.capacity,
    );
  }

  /**
   * excecutes before fetching centers
   * @param { object } loader
   * @returns { void }
   */
  beforeLoad(loader) {
    this.loaded = false;
    loader.classList.add('success-background');
    this.fieldset.disabled = true;
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
   * onScroll event handler
   * @returns { void }
   */
  handleScroll() {
    if (window.innerHeight + window.scrollY === document.body.offsetHeight) {
      this.offset += this.increase;
      CenterActions.updateCenters(
        this.subLoader,
        this.beforeLoad,
        this.onLoadSuccessful,
        this.onLoadFail,
        this.offset,
        this.limit,
        this.filter,
        this.facility,
        this.capacity,
      );
    }
  }

  /**
   * renders component in browser
   * @returns { component } to be rendered on the page
   */
  render() {
    return (
      <React.Fragment>
        <div
          className="centers-loader"
          ref={(input) => { this.mainLoader = input; }}
        />
        <div className="centers-container">
          {
            this.props.alert ? (
              <div className="alert alert-info" role="alert">
                <strong>{this.props.alert}</strong>
              </div>
            ) : ''
          }
          <fieldset ref={(input) => { this.fieldset = input; }}>
            <form onSubmit={this.onSubmit}>
              <div className="row">
                <div className="col-md-10">
                  <div className="row">
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control filter"
                        placeholder="Name or Address"
                        ref={(input) => { this.filterField = input; }}
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control filter"
                        placeholder="Facility"
                        ref={(input) => { this.facilityField = input; }}
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="number"
                        className="form-control filter"
                        min="1"
                        max="2147483647"
                        placeholder="Capacity"
                        ref={(input) => { this.capacityField = input; }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-2">
                  <input
                    type="submit"
                    className="form-control filter btn btn-outline-primary"
                    defaultValue="Filter"
                  />
                </div>
              </div>
            </form>
          </fieldset>
          {
            this.props.centers.length > 0 ? (
              <div className="row">
                {
                  this.props.centers.map(center => (
                    <div
                      className="col-md-6 col-lg-4 single-center"
                      key={center.id}
                    >
                      <Center center={center} history={this.props.history} />
                    </div>
                    ))
              }
              </div>
            ) : ''
          }
          <div
            className="centers-loader"
            ref={(input) => { this.subLoader = input; }}
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  centers: state.centersState,
  alert: state.alertState,
});

export default connect(mapStateToProps)(Centers);
