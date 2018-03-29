import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import NavTab from './TabComponent';
import Main from './MainComponent';
import Helpers from './../Helpers';
import CenterActions from '../actions/centerActions';

class App extends React.Component {
  componentDidMount() {
    axios
      .get(`${Helpers.localHost}/centers`)
      .then((response) => {
        CenterActions.updateCentersState(response.data);
      });
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
export default App;
