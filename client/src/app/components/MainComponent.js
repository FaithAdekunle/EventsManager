import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import Home from './HomeComponent';
import EventCenters from './EventCentersComponent';
import Signin from './SigninComponent';
import Signup from './SignupComponent';
import Admin from './AdminComponent';
import UserEvents from './UserEventsComponent';

const Main = props => (
  <div>
    <Switch>
      <Route
        exact
        path="/home"
        component={Home}
      />
      <Route
        exact
        path="/signin"
        render={() => (
          <Signin
            updateNavTabState={props.updateNavTabState}
            updateUserState={props.updateUserState}
          />
        )}
      />
      <Route
        exact
        path="/signup"
        render={() => (
          <Signup
            updateNavTabState={props.updateNavTabState}
            updateUserState={props.updateUserState}
          />
        )}
      />
      <Route
        path="/admin"
        render={() => (
          <Admin updateNavTabState={props.updateNavTabState} />
        )}
      />
      <Route
        path="/events"
        render={() => (
          <UserEvents updateNavTabState={props.updateNavTabState} />
        )}
      />
      <Route
        path="/centers"
        component={EventCenters}
      />
      <Redirect from="*" to="/home" />
    </Switch>
  </div>
);

export default Main;
