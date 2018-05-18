import React from 'react';
import { Switch, Redirect, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import HomePageComponent from './HomePageComponent.jsx';
import CentersWrapperComponent from './Center/CentersWrapperComponent.jsx';
import SigninComponent from './Sign/SigninComponent.jsx';
import SignupComponent from './Sign/SignupComponent.jsx';
import EventsWrapperComponent from './Event/EventsWrapperComponent.jsx';

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
                <HomePageComponent {...props} />
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
                <SigninComponent {...props} />
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
                <SignupComponent {...props} />
              )
            )
          }
        />
        <Route
          path="/events"
          render={props => (
              token && !userIsAdmin ? (
                <EventsWrapperComponent {...props} />
              ) : (
                <Redirect to="/signin" />
              )
            )
          }
        />
        <Route
          path="/centers"
          component={CentersWrapperComponent}
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
