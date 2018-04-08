import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import NavTab from './TabComponent';
import Main from './MainComponent';


const App = () => {
  return (
    <BrowserRouter>
      <React.Fragment>
        <NavTab />
        <Main />
      </React.Fragment>
    </BrowserRouter>
  );
};
export default App;
