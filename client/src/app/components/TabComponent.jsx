import React from 'react';
import { withRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import Helpers from '../Helpers';
import OtherActions from './../actions/otherActions';

/**
 * NavTab component class
 */
class NavTab extends React.Component {
  static propTypes = {
    token: Proptypes.string,
    history: Proptypes.object,
    location: Proptypes.object,
    centerSearch: Proptypes.array,
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
    if (!(this.props.location.pathname === '/centers')) {
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
    if (!value) return OtherActions.updateCenterSearch([]);
    return OtherActions.updateSearch(value);
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
              <a
                className="nav-link navTo text-white"
                onClick={() => this.navTo('/admin')}
              >
                Admin
              </a>
            </li>
            <li className="nav-item pull-right">
              <a
                className="nav-link navTo text-white"
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
                className="dropdown-item navTo"
                onClick={() => this.navTo('/events')}
              >
                My Events
              </a>
              <div className="dropdown-divider" />
              <a className="dropdown-item navTo" onClick={this.signout}>
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
              className="nav-link text-white navTo"
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
              className="nav-link text-white navTo"
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
          className="navbar navbar-fixed-top navbar-expand-lg
           navbar-light bg-dark"
        >
          <a
            className="navbar-brand text-white mr-auto navTo"
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
                className="form-inline ml-auto my-lg-0"
                onSubmit={NavTab.searchSubmit}
              >
                <div className="search-entry">
                  <input
                    type="text"
                    className="form-control window-exclude"
                    placeholder="search centers"
                    aria-describedby="navbar-search"
                    onKeyUp={(e) => { this.searchCenter(e); }}
                    onFocus={this.onFocus}
                  />
                  <ul
                    className="list-group search-result"
                    ref={(input) => { this.searchList = input; }}
                  >
                    {
                      this.props.centerSearch.map(center => (
                        <li
                          className="list-group-item window-exclude"
                          key={center.id}
                          onClick={() => this.navToCenter(center.id)}
                        >
                          {`${center.name} - ${center.address}`}
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
                  className="nav-link text-white navTo"
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
  centerSearch: state.centerSearch,
});

export default withRouter(connect(mapStateToProps)(NavTab));
