import React from 'react';
import { withRouter } from 'react-router-dom';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import Helpers from '../Helpers';

class NavTab extends React.Component {
  static propTypes = {
    pageState: Proptypes.object,
    history: Proptypes.object,
    location: Proptypes.object,
    centerSearch: Proptypes.array,
    centers: Proptypes.array,
    updateCenterSearch: Proptypes.func,
    updateCenterFilter: Proptypes.func,
  }

  constructor() {
    super();
    this.navTo = this.navTo.bind(this);
    this.signout = this.signout.bind(this);
    this.searchCenter = this.searchCenter.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
  }

  navTo(destination) {
    this.props.history.push(destination);
  }

  signout() {
    localStorage.removeItem('eventsManager');
    this.navTo('/home');
  }

  searchCenter(e) {
    const { value } = e.target;
    this.props.updateCenterFilter(value);
    if (e.keyCode === 13) {
      this.props.updateCenterSearch([]);
      this.searchBar.blur();
      return this.navTo('/centers');
    }
    if (!value) return this.props.updateCenterSearch([]);
    const match = new RegExp(value, 'gi');
    const matches = this.props.centers
      .filter(center => center.address.match(match) || center.name.match(match));
    return this.props.updateCenterSearch(matches);
  }

  searchSubmit(e) {
    e.preventDefault();
  }

  navToCenter(id) {
    this.props.updateCenterSearch([]);
    this.props.history.push(`/centers/${id}`);
  }

  render() {
    const { pageState } = this.props;
    const eventsManager = JSON.parse(localStorage.getItem('eventsManager'));
    const userState = eventsManager ? eventsManager.userState : null;
    const loginState = eventsManager ? eventsManager.loginState : {
      userIsSignedIn: false,
      userIsAdmin: false,
    };
    let firstLink = '';
    let secondLink = '';
    let thirdLink = '';
    let fourthLink = '';
    if (loginState.userIsSignedIn) {
      if (loginState.userIsAdmin) {
        fourthLink = (
          <React.Fragment>
            <li className="nav-item">
              <a className="nav-link navTo text-white" onClick={() => this.navTo('/admin')}>Admin</a>
            </li>
            <li className="nav-item pull-right">
              <a className="nav-link navTo text-white" onClick={this.signout} >Sign out</a>
            </li>
          </React.Fragment>
        );
      } else {
        thirdLink = (
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle text-white navTo" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{Helpers.getFirstName(userState.fullname)}</a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <a className="dropdown-item navTo" onClick={() => this.navTo('/events')}>My Events</a>
              <div className="dropdown-divider" />
              <a className="dropdown-item navTo" onClick={this.signout}>Sign out</a>
            </div>
          </li>);
      }
    } else {
      if (!pageState.userOnSignInPage) firstLink = (<li className="nav-item"><a className="nav-link text-white navTo" onClick={() => this.navTo('/signin')}>Sign in</a></li>);
      if (!pageState.userOnSignUpPage) secondLink = (<li className="nav-item"><a className="nav-link text-white navTo"onClick={() => this.navTo('/signup')}>Sign up</a></li>);
    }
    return (
      <React.Fragment>
        <nav className="navbar navbar-fixed-top navbar-expand-lg navbar-light bg-dark">
          <a className="navbar-brand text-white mr-auto navTo" onClick={() => this.navTo('/home')}>EventsManager</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <form className="form-inline ml-auto my-lg-0" onSubmit={this.searchSubmit} ref={(form) => { this.searchForm = form; }}>
              <div className="search-entry">
                <input type="text" className="form-control" placeholder="search centers" aria-describedby="navbar-search" onKeyUp={this.searchCenter} onFocus={this.searchCenter} ref={(input) => { this.searchBar = input; }} />
                <ul className="list-group search-result" ref={(input) => { this.searchResult = input; }}>
                  {
                    this.props.location.pathname === '/centers' ? null :
                    this.props.centerSearch.map((center) => {
                      return (
                        <li className="list-group-item" key={center.id} onClick={() => this.navToCenter(center.id)}>
                          {`${center.name} - ${center.address}`}
                        </li>
                      );
                    })
                  }
                </ul>
              </div>
            </form>
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
              <li className="nav-item">
                <a className="nav-link text-white navTo" onClick={() => this.navTo('/centers')}>Centers</a>
              </li>
              {firstLink}
              {secondLink}
              {thirdLink}
              {fourthLink}
            </ul>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    pageState: state.pageState,
    centers: state.centersState,
    centerSearch: state.centerSearch,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCenterSearch: (result) => {
      dispatch({
        type: 'UPDATE_CENTER_SEARCH',
        payload: result,
      });
    },
    updateCenterFilter: (value) => {
      dispatch({
        type: 'UPDATE_CENTER_FILTER',
        payload: value,
      });
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavTab));
