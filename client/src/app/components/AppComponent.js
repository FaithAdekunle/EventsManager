import React from 'react';
import NavTab from './TabComponent';
import Main from './MainComponent';

class App extends React.Component {
  render() {
    return (
      <div>
        <NavTab />
        <Main />
      </div>
    );
  }
}

export default App;
