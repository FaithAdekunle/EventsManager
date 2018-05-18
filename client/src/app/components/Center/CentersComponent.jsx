import React from 'react';
import Proptypes from 'prop-types';
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import CenterCardComponent from './CenterCardComponent.jsx';
import AddOrEditCenterComponent from './AddOrEditCenterComponent.jsx';
import OtherActions from '../../actions/otherActions';
import CenterActions from '../../actions/centerActions';
import constants from '../../constants';
import DialApi from '../../DialApi';

/**
 * Centers component class
 */
class CentersComponent extends React.Component {
  static propTypes = {
    centers: Proptypes.array,
    alert: Proptypes.string,
    token: Proptypes.string,
    history: Proptypes.object,
    pagination: Proptypes.object,
  }

  /**
   * executes after component mounts
   * @param { object } event
   * @returns { void }
   */
  static openCenterModal(event) {
    event.preventDefault();
    const modal = $('#centerModal');
    modal.modal({
      show: true,
      keyboard: false,
      backdrop: 'static',
    });
  }

  /**
   * constructor
   */
  constructor() {
    super();
    this.offset = 0;
    this.limit = 9;
    this.filter = '';
    this.capacity = 1;
    this.facility = '';
    this.loaded = false;
    this.onSubmit = this.onSubmit.bind(this);
    this.onLoadFail = this.onLoadFail.bind(this);
    this.beforeLoad = this.beforeLoad.bind(this);
    this.load = this.load.bind(this);
    this.onLoadSuccessful = this.onLoadSuccessful.bind(this);
    this.loadNextPage = this.loadNextPage.bind(this);
    this.onCenterAdded = this.onCenterAdded.bind(this);
  }

  /**
   * executes after component mounts
   * @returns { void }
   */
  componentDidMount() {
    DialApi.updateCenters(
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
    OtherActions.setAlert(null);
    OtherActions.setPagination(null);
    CenterActions.setCenters([]);
  }

  /**
   * executes upon failed centers fetch
   * @param { object } response
   * @returns { void }
   */
  onLoadFail(response) {
    if (this.offset > 0) this.offset -= this.increase;
    if (this.fieldset) this.fieldset.disabled = false;
    if (response) {
      if (this.mainLoader) this.mainLoader.style.width = '100%';
      setTimeout(() => {
        if (this.mainLoader) {
          this.mainLoader.classList.remove('success-background');
        }
        OtherActions.setAlert(response.data.error);
      }, 500);
    } else {
      OtherActions.setAlert(constants.NO_CONNECTION);
    }
  }

  /**
   * executes after centers have been fetched
   * @param { object } data
   * @returns { void }
   */
  onLoadSuccessful(data) {
    const { centers } = data;
    this.loaded = true;
    if (this.fieldset) this.fieldset.disabled = false;
    if (this.mainLoader) this.mainLoader.style.width = '100%';
    setTimeout(() => {
      if (this.mainLoader) {
        this.mainLoader.classList.remove('success-background');
      }
      CenterActions.setCenters(centers);
      if (centers.length === 0) OtherActions.setAlert(constants.NO_CENTERS);
      OtherActions.setPagination(data.metaData.pagination);
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
    CenterActions.setCenters([]);
    OtherActions.setPagination(null);
    DialApi.updateCenters(
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
   * runs when new center is added
   * @returns { void }
   */
  onCenterAdded() {
    this.loadNextPage(1);
  }

  /**
   * displays loader bar
   * @param { integer } nextPage
   * @returns { void }
   */
  loadNextPage(nextPage) {
    this.offset = this.limit * (nextPage - 1);
    DialApi.updateCenters(
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
   * displays loader bar
   * @param { integer } start
   * @param { integer } increase
   * @param { integer } interval
   * @returns { void }
   */
  load(start = 0, increase = 2, interval = 50) {
    if (!this.loaded && start < 70) {
      start += increase;
      if (this.mainLoader) this.mainLoader.style.width = `${start}%`;
      if (start === 50) {
        interval = 1000;
      }
      setTimeout(() => {
        this.load(start, increase, interval);
      }, interval);
    }
  }

  /**
   * excecutes before fetching centers
   * @returns { void }
   */
  beforeLoad() {
    window.scrollTo(0, 0);
    this.loaded = false;
    this.mainLoader.classList.add('success-background');
    this.fieldset.disabled = true;
    OtherActions.setAlert(null);
    this.load();
  }

  /**
   * renders component in browser
   * @returns { component } to be rendered on the page
   */
  render() {
    const { pagination, token, alert } = this.props;
    const { NO_CONNECTION, NO_CENTERS } = constants;
    let userIsAdmin = false;
    try {
      userIsAdmin = (jwtDecode(token)).isAdmin;
    } catch (error) {
      userIsAdmin = false;
    }
    return (
      <React.Fragment>
        <div
          className="centers-loader"
          ref={(input) => { this.mainLoader = input; }}
        />
        <div className="centers-container">
          <div className="fill-width">
            <fieldset ref={(input) => { this.fieldset = input; }}>
              <form onSubmit={this.onSubmit}>
                <div className="row">
                  <div className={userIsAdmin ? 'col-md-8' : 'col-md-10'}>
                    <div className="row">
                      <div className="col-md-5">
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
                      <div className="col-md-3">
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
                  <div className={userIsAdmin ? 'col-md-4' : 'col-md-2'}>
                    <div className="row">
                      <div className={userIsAdmin ? 'col-md-6' : 'col-md-12'}>
                        <input
                          type="submit"
                          className="form-control filter btn
                            btn-outline-primary"
                          defaultValue="Filter"
                        />
                      </div>
                      {
                        userIsAdmin ? (
                          <div className="col-md-6">
                            <button
                              className="btn btn-primary btn-block"
                              onClick={CentersComponent.openCenterModal}
                            >
                              Add Center
                            </button>
                          </div>
                        ) : ''
                      }
                    </div>
                  </div>
                </div>
              </form>
            </fieldset>
            {
              alert === NO_CONNECTION || alert === NO_CENTERS ? (
                <div className="alert alert-info" role="alert">
                  <strong>{alert}</strong>
                </div>
              ) : ''
            }
            {
              this.props.centers.length > 0 ? (
                <div className="row">
                  {
                    this.props.centers.map(center => (
                      <div
                        className="col-md-6 col-lg-4 single-center"
                        key={center.id}
                      >
                        <CenterCardComponent
                          center={center}
                          history={this.props.history}
                        />
                      </div>
                      ))
                }
                </div>
              ) : ''
            }
          </div>
          <div className="margin-center">
            {
              pagination ? (
                <Pagination
                  pageSize={this.limit}
                  defaultCurrent={pagination.currentPage}
                  total={pagination.totalCount}
                  onChange={this.loadNextPage}
                  showTitle={false}
                  hideOnSinglePage
                />
              ) : ''
            }
          </div>
          {
            userIsAdmin ? (
              <AddOrEditCenterComponent
                history={this.props.history}
                onCenterAdded={this.onCenterAdded}
              />
            ) : ''
          }
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  token: state.token,
  centers: state.centers,
  alert: state.alert,
  pagination: state.paginationMetadata,
});

export default connect(mapStateToProps)(CentersComponent);
