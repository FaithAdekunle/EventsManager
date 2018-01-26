import React from 'react';
import Proptypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import Center from './CenterComponent';

class Centers extends React.Component {
  static propTypes = {
    centers: Proptypes.array,
    alert: Proptypes.string,
    history: Proptypes.object,
    updateCentersState: Proptypes.func,
    updateAlertState: Proptypes.func,
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
    this.props.updateAlertState(null);
  }

  render() {
    return (
      <div>
        <div className="centers-loader success-background" ref={(input) => { this.loader = input; }} />
        <div className="centers-container">
          <div className={`container ${!this.props.alert ? 'hidden' : ''}`}>
            <div className="alert alert-info" role="alert">
              <strong>{this.props.alert}</strong>
            </div>
          </div>
          {this.props.centers.map((center) => {
            return (
              <Center center={center} history={this.props.history} key={center.id} />
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    centers: state.centersState,
    alert: state.alertState,
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
    updateCentersState: (centers) => {
      dispatch({
        type: 'UPDATE_CENTERS_STATE',
        payload: centers,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Centers);
