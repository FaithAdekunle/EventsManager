import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import CenterDetails from './CenterDetailsComponent';
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
            component={CenterDetails}
          />
          <Redirect from="/centers/*" to="/centers" />
        </Switch>
      </div>
    );
  }
}

export default EventCenters;
