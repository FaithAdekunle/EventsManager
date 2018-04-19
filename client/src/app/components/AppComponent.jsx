import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import NavTab from './TabComponent.jsx';
import Main from './MainComponent.jsx';


const App = () => (
  <BrowserRouter>
    <React.Fragment>
      <NavTab />
      <Main />
    </React.Fragment>
  </BrowserRouter>
);
export default App;
