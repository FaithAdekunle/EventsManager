import React from 'react';
import { withRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import Helpers from '../Helpers';
import OtherActions from './../actions/others';

/**
 * NavTab component class
 */
class NavTab extends React.Component {
  static propTypes = {
    token: Proptypes.string,
    pageState: Proptypes.object,
    history: Proptypes.object,
    location: Proptypes.object,
    centerSearch: Proptypes.array,
    centers: Proptypes.array,
  }

  /**
   * constructor
   */
  constructor() {
    super();
    this.navTo = this.navTo.bind(this);
    this.signout = this.signout.bind(this);
    this.searchCenter = this.searchCenter.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
  }

  /**
   * navigates to specified destination
   * @param { string } destination
   * @returns { void }
   */
  navTo(destination) {
    this.props.history.push(destination);
  }

  /**
   * sign user/admin out
   * @returns { void }
   */
  signout() {
    OtherActions.removeToken();
    this.navTo('/home');
  }

  /**
   * search center
   * @param { object } e
   * @returns { void }
   */
  searchCenter(e) {
    const { value } = e.target;
    OtherActions.updateCenterFilter(value);
    if (e.keyCode === 13) {
      OtherActions.updateCenterSearch([]);
      this.searchBar.blur();
      return this.navTo('/centers');
    }
    if (!value) return OtherActions.updateCenterSearch([]);
    const match = new RegExp(value, 'gi');
    const matches = this.props.centers
      .filter(center => center.address.match(match) || center.name.match(match));
    return OtherActions.updateCenterSearch(matches);
  }

  /**
   * prevents default form submit
   * @param { object } e
   * @returns { void }
   */
  searchSubmit(e) {
    e.preventDefault();
  }

  /**
   * navigates to center details page
   * @param { number } id
   * @returns { void }
   */
  navToCenter(id) {
    OtherActions.updateCenterSearch([]);
    this.props.history.push(`/centers/${id}`);
  }

  /**
   * renders component in browser
   * @returns { component } to be rendered on the page
   */
  render() {
    const { pageState, token } = this.props;
    // const eventsManager = JSON.parse(localStorage.getItem('eventsManager'));
    let user = null;
    try {
      // user = jwtDecode(eventsManager.appToken);
      user = jwtDecode(token);
    } catch (error) {
      user = null;
    }
    const fullName = user ? user.fullName : null;
    const userIsAdmin = user ? user.isAdmin : false;
    let firstLink = '';
    let secondLink = '';
    let thirdLink = '';
    let fourthLink = '';
    if (user) {
      if (userIsAdmin) {
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
            <a className="nav-link dropdown-toggle text-white navTo" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{Helpers.getFirstName(fullName)}</a>
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
                <input type="text" className="form-control" placeholder="search centers" aria-describedby="navbar-search" onKeyUp={(e) => { this.searchCenter(e); OtherActions.resetPageLimit(); }} onFocus={this.searchCenter} ref={(input) => { this.searchBar = input; }} />
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
    token: state.token,
    pageState: state.pageState,
    centers: state.centersState,
    centerSearch: state.centerSearch,
  };
};

export default withRouter(connect(mapStateToProps)(NavTab));
