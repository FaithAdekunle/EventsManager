import React from 'react';
import { Switch, Redirect, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import Home from './HomeComponent.jsx';
import EventCenters from './Center/EventCentersComponent.jsx';
import Signin from './Sign/SigninComponent.jsx';
import Signup from './Sign/SignupComponent.jsx';
import UserEvents from './Event/UserEventsComponent.jsx';

const Main = (properties) => {
  const { token } = properties;
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
                <Redirect to={`${userIsAdmin ? '/centers' : '/events'}`} />
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
                <Redirect to={`${userIsAdmin ? '/centers' : '/events'}`} />
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
                <Redirect to={`${userIsAdmin ? '/centers' : '/events'}`} />
              ) : (
                <Signup {...props} />
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
};

const mapStateToProps = state => ({
  token: state.token,
});

export default withRouter(connect(mapStateToProps)(Main));
