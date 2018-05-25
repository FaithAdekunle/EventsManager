import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import EventsComponent from './EventsComponent.jsx';

export const EventsWrapperComponent = () => (
  <React.Fragment>
    <Switch>
      <Route exact path="/events" component={EventsComponent} />
      <Redirect from="/events/*" to="/events" />
    </Switch>
  </React.Fragment>
);

export default EventsWrapperComponent;
