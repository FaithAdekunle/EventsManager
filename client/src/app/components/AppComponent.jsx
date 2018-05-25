import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import NavBarComponent from './NavBarComponent.jsx';
import MainComponent from './MainComponent.jsx';


const AppComponent = () => (
  <BrowserRouter>
    <React.Fragment>
      <NavBarComponent />
      <MainComponent />
    </React.Fragment>
  </BrowserRouter>
);
export default AppComponent;
