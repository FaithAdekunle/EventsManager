import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import Events from './EventsComponent';
import AddEvent from './AddEventComponent';
import EditEvent from './EditEventComponent';

class UserEvents extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/events" component={Events} />
          <Route exact path="/events/add" component={AddEvent} />
          <Route exact path="/events/:id/edit" component={EditEvent} />
          <Redirect from="/events/*" to="/events" />
        </Switch>
      </div>
    );
  }
}

export default UserEvents;
