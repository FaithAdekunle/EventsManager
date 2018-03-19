import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import NavTab from './TabComponent';
import Main from './MainComponent';
import Helpers from './../Helpers';

class App extends React.Component {
  static propTypes = {
    updateCentersState: Proptypes.func,
  }

  componentDidMount() {
    axios
      .get(`${Helpers.localHost}/centers`)
      .then((response) => {
        this.props.updateCentersState(response.data);
      })
      .catch(() => null);
  }
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <NavTab />
          <Main />
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateCentersState: (centers) => {
      dispatch({
        type: 'UPDATE_CENTERS_STATE',
        payload: centers,
      });
    },
  };
};

export default connect(null, mapDispatchToProps)(App);
