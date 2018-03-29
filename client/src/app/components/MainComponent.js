import React from 'react';
import { Switch, Redirect, Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import Home from './HomeComponent';
import EventCenters from './Center/EventCentersComponent';
import Signin from './Sign/SigninComponent';
import Signup from './Sign/SignupComponent';
import Admin from './Admin/AdminComponent';
import UserEvents from './Event/UserEventsComponent';

class Main extends React.Component {
  static propTypes = {
    token: PropTypes.string,
  }

  render() {
    const { token } = this.props;
    let userIsAdmin = false;
    try {
      userIsAdmin = (jwtDecode(token)).isAdmin;
    } catch (error) {
      userIsAdmin = false;
    }
    return (
      <React.Fragment>
        <Switch>
          <Route
            exact
            path="/home"
            render={props => (
                token ? (
                  <Redirect to={`${userIsAdmin ? '/admin' : '/events'}`} />
                ) : (
                  <Home {...props} />
                )
              )
            }
          />
          <Route
            exact
            path="/signin"
            render={props => (
                token ? (
                  <Redirect to={`${userIsAdmin ? '/admin' : '/events'}`} />
                ) : (
                  <Signin {...props} />
                )
              )
            }
          />
          <Route
            exact
            path="/signup"
            render={props => (
                token ? (
                  <Redirect to={`${userIsAdmin ? '/admin' : '/events'}`} />
                ) : (
                  <Signup {...props} />
                )
              )
            }
          />
          <Route
            path="/admin"
            render={props => (
                userIsAdmin ? (
                  <Admin {...props} />
                ) : (
                  <Redirect to="/signin" />
                )
              )
            }
          />
          <Route
            path="/events"
            render={props => (
                token && !userIsAdmin ? (
                  <UserEvents {...props} />
                ) : (
                  <Redirect to="/signin" />
                )
              )
            }
          />
          <Route
            path="/centers"
            component={EventCenters}
          />
          <Redirect from="*" to="/home" />
        </Switch>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token,
  };
};

export default withRouter(connect(mapStateToProps)(Main));
