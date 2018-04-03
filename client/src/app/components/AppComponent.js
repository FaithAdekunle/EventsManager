import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import NavTab from './TabComponent';
import Main from './MainComponent';
import Helpers from './../Helpers';
import CenterActions from '../actions/centerActions';

/**
 * App component class
 */
class App extends React.Component {
  /**
   * executes after component mounts
   * @returns { void }
   */
  componentDidMount() {
    axios
      .get(`${Helpers.localHost}/centers`)
      .then((response) => {
        CenterActions.updateCentersState(response.data);
      });
  }

  /**
   * renders component in browser
   * @returns { component } to be rendered on the page
   */
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
