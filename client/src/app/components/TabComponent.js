import React from 'react';

class NavTab extends React.Component {
  render() {
    const { navTabState, userState } = this.props;
    if (!navTabState.isAdmin) {
      let firstLink = (<li className="nav-item"><a className="nav-link text-white" href="/signin">Sign in</a></li>);
      let secondLink = (<li className="nav-item active"><a className="nav-link text-white" href="/signup">Sign up</a></li>);
      if (!navTabState.isSignedIn) {
        if (navTabState.onSignupPage) firstLink = null;
        if (navTabState.onSignInPage) secondLink = null;
      } else {
        firstLink = null;
        secondLink = (
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{userState.fullname.split(' ').join('_')}</a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <a className="dropdown-item" href="./add_event.html">Add Event</a>
              <div className="dropdown-divider" />
              <a className="dropdown-item" href="#">Sign out</a>
            </div>
          </li>);
      }
      return (
        <div>
          <nav className="navbar navbar-fixed-top navbar-expand-lg navbar-light bg-dark">
            <a href="/" className="navbar-brand text-white mr-auto">EventsManager</a>
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
                  <a className="nav-link text-white" href="/centers">Centers</a>
                </li>
                {firstLink}
                {secondLink}
              </ul>
            </div>
          </nav>
        </div>
      );
    }
    return (
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a className="nav-link active" href="/admin">Centers</a>
        </li>
        <li className="nav-item pull-right">
          <a className="nav-link" href="/">Sign out</a>
        </li>
      </ul>
    );
  }
}

export default NavTab;
