import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import Events from './EventsComponent.jsx';
import EditEvent from './EditEventComponent.jsx';

const UserEvents = () => (
  <React.Fragment>
    <Switch>
      <Route exact path="/events" component={Events} />
      <Route exact path="/events/:id/edit" component={EditEvent} />
      <Redirect from="/events/*" to="/events" />
    </Switch>
  </React.Fragment>
);

export default UserEvents;
