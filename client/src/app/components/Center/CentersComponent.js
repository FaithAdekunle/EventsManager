import React from 'react';
import Proptypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import Center from './CenterComponent';
import Helpers from '../../Helpers';

class Centers extends React.Component {
  static propTypes = {
    centers: Proptypes.array,
    filter: Proptypes.string,
    alert: Proptypes.string,
    history: Proptypes.object,
    limit: Proptypes.number,
    updateCentersState: Proptypes.func,
    updatePageLimit: Proptypes.func,
    resetPageLimit: Proptypes.func,
    updateAlertState: Proptypes.func,
  }

  constructor() {
    super();
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, false);
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
      .get(`${Helpers.localHost}/centers`)
      .then((response) => {
        loaded = true;
        this.loader.style.width = '100%';
        this.props.updateCentersState(response.data);
        setTimeout(() => { this.loader.classList.remove('success-background'); }, 500);
      })
      .catch(() => this.props.updateAlertState('Looks like you\'re offline. Check internet connection.'));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, false);
    this.props.resetPageLimit();
    this.props.updateAlertState(null);
  }

  handleScroll() {
    if (window.innerHeight + window.scrollY === document.body.offsetHeight &&
        this.props.limit < this.props.centers.length) {
      this.props.updatePageLimit();
    }
  }

  render() {
    const { limit } = this.props;
    let pointer = 0;
    return (
      <React.Fragment>
        <div className="centers-loader success-background" ref={(input) => { this.loader = input; }} />
        <div className="centers-container">
          <div className={`${!this.props.alert ? 'hidden' : ''}`}>
            <div className="alert alert-info" role="alert">
              <strong>{this.props.alert}</strong>
            </div>
          </div>
          <div className="row">
            {
              this.props.centers.map((center) => {
              const match = new RegExp(this.props.filter, 'gi');
              if (center.name.match(match) || center.address.match(match)) {
                if (pointer < limit) {
                  pointer++;
                  return (
                    <div className="col-md-6 col-lg-4" key={center.id}>
                      <Center center={center} history={this.props.history} />
                    </div>
                  );
                }
              }
              return null;
            })
            }
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    centers: state.centersState,
    filter: state.centerFilter,
    alert: state.alertState,
    limit: state.limit,
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
    updatePageLimit: () => {
      dispatch({
        type: 'UPDATE_CENTERS_PAGE_LIMIT',
      });
    },
    resetPageLimit: () => {
      dispatch({
        type: 'RESET_CENTERS_PAGE_LIMIT',
      });
    },
    updateCentersState: (centers) => {
      dispatch({
        type: 'UPDATE_CENTERS_STATE',
        payload: centers,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Centers);
