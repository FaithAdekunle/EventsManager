import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import NavTab from './TabComponent';
import Main from './MainComponent';

class App extends React.Component {
  static propTypes = {
    updateCentersState: Proptypes.func,
  }

  componentDidMount() {
    axios
      .get('http://localhost:7777/api/v1/centers')
      .then((response) => {
        this.props.updateCentersState(response.data);
      })
      .catch(() => null);
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          <NavTab />
          <Main />
        </div>
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
