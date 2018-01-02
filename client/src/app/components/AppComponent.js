import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import NavTab from './TabComponent';
import Main from './MainComponent';

class App extends React.Component {
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

export default App;
