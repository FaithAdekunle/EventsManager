import React from 'react';
import { withRouter } from 'react-router-dom';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';

class NavTab extends React.Component {
  static propTypes = {
    loginState: Proptypes.object,
    pageState: Proptypes.object,
    userState: Proptypes.object,
    history: Proptypes.object,
    updateUserState: Proptypes.func,
    updateLoginState: Proptypes.func,
  }

  constructor() {
    super();
    this.navTo = this.navTo.bind(this);
    this.signout = this.signout.bind(this);
  }

  getFirstName(fullName) {
    const firstName = fullName.split(' ')[0];
    return `${firstName[0].toUpperCase()}${firstName.slice(1)}`;
  }

  navTo(destination) {
    this.props.history.push(destination);
  }

  signout() {
    localStorage.removeItem('eventsManager');
    this.props.updateUserState({ email: null, fullname: null });
    this.props.updateLoginState({ userIsSignedIn: false, userIsAdmin: false });
    this.navTo('/home');
  }

  render() {
    const { loginState, pageState, userState } = this.props;
    if (!loginState.userIsAdmin) {
      let firstLink = (<li className="nav-item"><a className="nav-link text-white navTo" onClick={() => this.navTo('/signin')}>Sign in</a></li>);
      let secondLink = (<li className="nav-item active"><a className="nav-link text-white navTo"onClick={() => this.navTo('/signup')}>Sign up</a></li>);
      if (!loginState.userIsSignedIn) {
        if (pageState.userOnSignInPage) firstLink = null;
        if (pageState.userOnSignUpPage) secondLink = null;
      } else if (userState.fullname) {
        firstLink = null;
        secondLink = (
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle text-white navTo" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.getFirstName(userState.fullname)}</a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <a className="dropdown-item navTo" onClick={() => this.navTo('/events')}>My Events</a>
              <div className="dropdown-divider" />
              <a className="dropdown-item navTo" onClick={this.signout}>Sign out</a>
            </div>
          </li>);
      }
      return (
        <div>
          <nav className="navbar navbar-fixed-top navbar-expand-lg navbar-light bg-dark">
            <a className="navbar-brand text-white mr-auto navTo" onClick={() => this.navTo('/home')}>EventsManager</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <form className="form-inline ml-auto my-lg-0">
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="search centers" aria-describedby="navbar-search" />
                  <span className="input-group-addon" id="navbar-search"><i className="fa fa-search" aria-hidden="true" /></span>
                </div>
              </form>
              <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                <li className="nav-item">
                  <a className="nav-link text-white navTo" onClick={() => this.navTo('/centers')}>Centers</a>
                </li>
                {firstLink}
                {secondLink}
              </ul>
            </div>
          </nav>
        </div>
      );
    } else if (loginState.userIsSignedIn) {
      return (
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active navTo"onClick={() => this.navTo('/admin')}>Centers</a>
          </li>
          <li className="nav-item pull-right">
            <a className="nav-link navTo" onClick={this.signout} >Sign out</a>
          </li>
        </ul>
      );
    }
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    loginState: state.loginState,
    userState: state.userState,
    pageState: state.pageState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateLoginState: (loginState) => {
      dispatch({
        type: 'UPDATE_LOGIN_STATE',
        payload: loginState,
      });
    },
    updateUserState: (userState) => {
      dispatch({
        type: 'UPDATE_USER_STATE',
        payload: userState,
      });
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavTab));
