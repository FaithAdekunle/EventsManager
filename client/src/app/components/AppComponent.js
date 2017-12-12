import React from 'react';
import NavTab from './TabComponent';
import Main from './MainComponent';

class App extends React.Component {
  constructor() {
    super();
    // set initial state for the application
    this.state = {
      navTabState: {
        isSignedIn: false,
        isAdmin: false,
        onSigninPage: false,
        onSignupPage: false,
      },
      userState: {
        fullname: null,
        email: null,
      },
    };
    this.updateNavTabState = this.updateNavTabState.bind(this);
    this.updateUserState = this.updateUserState.bind(this);
  }

  updateNavTabState(navTabUpdate) {
    const navTabState = { ...this.state.navTabState, ...navTabUpdate };
    this.setState({ navTabState });
  }

  updateUserState(user) {
    const userState = {
      fullname: user.fullname,
      email: user.email,
    };
    this.setState({ userState });
  }

  render() {
    return (
      <div>
        <NavTab navTabState={this.state.navTabState} userState={this.state.userState} />
        <Main updateNavTabState={this.updateNavTabState} updateUserState={this.updateUserState} />
      </div>
    );
  }
}

export default App;
