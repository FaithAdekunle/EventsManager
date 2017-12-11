import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import Center from './CenterComponent';
import Centers from './CentersComponent';

class EventCenters extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route
            exact
            path="/centers"
            component={Centers}
          />
          <Route
            exact
            path="/centers/:id"
            component={Center}
          />
          <Redirect from="/centers/*" to="/centers" />
        </Switch>
      </div>
    );
  }
}

export default EventCenters;
