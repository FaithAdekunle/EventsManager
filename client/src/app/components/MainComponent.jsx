import React from 'react';
import { Switch, Redirect, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import HomePageComponent from './HomePageComponent.jsx';
import CentersWrapperComponent from './Center/CentersWrapperComponent.jsx';
import SigninComponent from './Sign/SigninComponent.jsx';
import SignupComponent from './Sign/SignupComponent.jsx';
import EventsWrapperComponent from './Event/EventsWrapperComponent.jsx';
import NotFoundComponent from './NotFoundComponent.jsx';

export const MainComponent = (properties) => {
  const { token } = properties;
  let userIsAdmin = false;
  try {
    userIsAdmin = (jwtDecode(token)).isAdmin;
  } catch (error) {
    userIsAdmin = false;
  }
  return (
    <div className="main">
      <Switch>
        <Route
          exact
          path="/"
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
          exact
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
          exact
          path="/centers"
          component={CentersWrapperComponent}
        />
        <Route
          path="*"
          component={NotFoundComponent}
        />
      </Switch>
    </div>
  );
};

const mapStateToProps = state => ({
  token: state.token,
});

export default withRouter(connect(mapStateToProps)(MainComponent));
