import React from 'react';
import { withRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import Helpers from '../Helpers';
import OtherActions from './../actions/otherActions';
import DialApi from './../DialApi';
import constants from '../constants';

/**
 * NavBarComponent component class
 */
export class NavBarComponent extends React.Component {
  static propTypes = {
    token: Proptypes.string,
    history: Proptypes.object,
    location: Proptypes.object,
    searchResults: Proptypes.array,
  }

  /**
   * executes on search successful
   * @param { array } centers
   * @returns { void }
   */
  static onSearchSuccessful(centers) {
    if (centers.length) return OtherActions.setSearchResults(centers);
    return OtherActions.setSearchResults([{
      name: 'Sorry! We could not find a match.',
    }]);
  }

  /**
   * executes on search fail
   * @param { object } response
   * @returns { void }
   */
  static onSearchFail(response) {
    if (!response) {
      OtherActions
        .setAlert(constants.NO_CONNECTION);
    }
  }

  /**
   * prevents default form submit
   * @param { object } e
   * @returns { void }
   */
  static searchSubmit(e) {
    e.preventDefault();
  }

  /**
   * constructor
   */
  constructor() {
    super();
    this.navTo = this.navTo.bind(this);
    this.signout = this.signout.bind(this);
    this.searchCenter = this.searchCenter.bind(this);
    this.onWindowClick = this.onWindowClick.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  /**
   * executes after component mounts
   * @returns { void }
   */
  componentDidMount() {
    window.addEventListener('click', this.onWindowClick);
  }

  /**
   * reveals search results
   * @returns { void }
   */
  onFocus() {
    if (this.searchField.value) {
      this.searchList.classList.remove('hidden');
    }
  }

  /**
   * hides search results
   * @param { object } e
   * @returns { void }
   */
  onWindowClick(e) {
    if ([...e.target.classList].includes('window-exclude')) return null;
    if (this.searchList) return this.searchList.classList.add('hidden');
    return null;
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
    this.searchList.classList.remove('hidden');
    const { value } = e.target;
    if (!value) return OtherActions.setSearchResults([]);
    return DialApi.updateSearch(
      value,
      NavBarComponent.onSearchSuccessful,
      NavBarComponent.onSearchFail,
    );
  }

  /**
   * navigates to center details page
   * @param { number } id
   * @returns { void }
   */
  navToCenter(id) {
    this.searchList.classList.add('hidden');
    this.props.history.push(`/centers/${id}`);
  }

  /**
   * renders component in browser
   * @returns { component } to be rendered on the page
   */
  render() {
    const { location, token } = this.props;
    let user = null;
    try {
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
            <li className="nav-item pull-right">
              <a
                className="nav-link navTo text-white signout"
                onClick={this.signout}
              >
                Sign out
              </a>
            </li>
          </React.Fragment>
        );
      } else {
        thirdLink = (
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle text-white navTo"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {Helpers.getFirstName(fullName)}
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <a
                className="dropdown-item navTo myEvents"
                onClick={() => this.navTo('/events')}
              >
                My Events
              </a>
              <div className="dropdown-divider" />
              <a className="dropdown-item navTo signout" onClick={this.signout}>
                Sign out
              </a>
            </div>
          </li>);
      }
    } else {
      if (location.pathname !== '/signin') {
        firstLink = (
          <li className="nav-item">
            <a
              className="nav-link text-white navTo signin"
              onClick={() => this.navTo('/signin')}
            >
              Sign in
            </a>
          </li>
        );
      }
      if (location.pathname !== '/signup') {
        secondLink = (
          <li className="nav-item">
            <a
              className="nav-link text-white navTo signup"
              onClick={() => this.navTo('/signup')}
            >
              Sign up
            </a>
          </li>
        );
      }
    }
    return (
      <React.Fragment>
        <nav
          className="navbar fixed-top navbar-expand-lg
           navbar-light bg-dark"
        >
          <a
            className="navbar-brand text-white mr-auto navTo home"
            onClick={() => this.navTo('/home')}
          >
            EventsManager
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {
              this.props.location.pathname === '/centers' ? null :
              <form
                className="form-inline ml-auto my-lg-0 search-form"
                onSubmit={NavBarComponent.searchSubmit}
              >
                <div className="search-entry">
                  <input
                    type="text"
                    className="form-control window-exclude search-centers"
                    placeholder="search centers"
                    aria-describedby="navbar-search"
                    onKeyUp={(e) => { this.searchCenter(e); }}
                    ref={(input) => { this.searchField = input; }}
                    onFocus={this.onFocus}
                  />
                  <ul
                    className="list-group search-result"
                    ref={(input) => { this.searchList = input; }}
                  >
                    {
                      this.props.searchResults.map(center => (
                        <li
                          className={`list-group-item window-exclude
                           ${!center.id ? 'text-center' : ''}`}
                          key={center.id || center.name}
                          onClick={() => {
                            if (center.id) this.navToCenter(center.id);
                          }}
                        >
                          {`${center.name}${center.address ?
                            ` - ${center.address}` : ''}`}
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </form>
            }
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
              <li className="nav-item">
                <a
                  className="nav-link text-white navTo centers-link"
                  onClick={() => this.navTo('/centers')}
                >
                  Centers
                </a>
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

const mapStateToProps = state => ({
  token: state.token,
  searchResults: state.searchResults,
});

export default withRouter(connect(mapStateToProps)(NavBarComponent));
