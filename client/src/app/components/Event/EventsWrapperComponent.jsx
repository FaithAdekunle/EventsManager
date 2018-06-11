import React from 'react';
import { Switch, Route } from 'react-router-dom';
import EventsComponent from './EventsComponent.jsx';

export const EventsWrapperComponent = () => (
  <React.Fragment>
    <Switch>
      <Route exact path="/events" component={EventsComponent} />
    </Switch>
  </React.Fragment>
);

export default EventsWrapperComponent;
