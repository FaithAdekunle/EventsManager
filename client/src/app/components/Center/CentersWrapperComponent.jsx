import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import CenterDetailsComponent from './CenterDetailsComponent.jsx';
import CentersComponent from './CentersComponent.jsx';


export const CentersWrapperComponent = () => (
  <React.Fragment>
    <Switch>
      <Route
        exact
        path="/centers"
        component={CentersComponent}
      />
      <Route
        exact
        path="/centers/:id"
        component={CenterDetailsComponent}
      />
      <Redirect from="/centers/*" to="/centers" />
    </Switch>
  </React.Fragment>
);

export default CentersWrapperComponent;
