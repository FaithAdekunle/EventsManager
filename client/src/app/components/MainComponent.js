import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import Home from './HomeComponent';
import EventCenters from './EventCentersComponent';
import Signin from './SigninComponent';
import Signup from './SignupComponent';
import Admin from './AdminComponent';
import UserEvents from './UserEventsComponent';

const Main = () =>
  (
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
          component={Signin}
        />
        <Route
          exact
          path="/signup"
          component={Signup}
        />
        <Route
          path="/admin"
          component={Admin}
        />
        <Route
          path="/events"
          component={UserEvents}
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
