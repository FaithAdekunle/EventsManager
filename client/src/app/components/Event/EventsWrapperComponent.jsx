import React from 'react';
import { Switch, Route } from 'react-router-dom';
import EventsComponent from './EventsComponent.jsx';
import NotFoundComponent from '../NotFoundComponent.jsx';

export const EventsWrapperComponent = () => (
  <React.Fragment>
    <Switch>
      <Route exact path="/events" component={EventsComponent} />
      <Route
        path="*"
        component={NotFoundComponent}
      />
    </Switch>
  </React.Fragment>
);

export default EventsWrapperComponent;
