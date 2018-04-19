import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import CenterDetails from './CenterDetailsComponent.jsx';
import Centers from './CentersComponent.jsx';


const EventCenters = () => (
  <React.Fragment>
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
  </React.Fragment>
);

export default EventCenters;
