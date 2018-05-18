import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import NavBarComponent from './NavBarComponent.jsx';
import Main from './MainComponent.jsx';


const App = () => (
  <BrowserRouter>
    <React.Fragment>
      <NavBarComponent />
      <Main />
    </React.Fragment>
  </BrowserRouter>
);
export default App;
