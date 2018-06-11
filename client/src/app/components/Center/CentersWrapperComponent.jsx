import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CenterDetailsComponent from './CenterDetailsComponent.jsx';
import CentersComponent from './CentersComponent.jsx';
import NotFoundComponent from '../NotFoundComponent.jsx';


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
      <Route
        path="*"
        component={NotFoundComponent}
      />
    </Switch>
  </React.Fragment>
);

export default CentersWrapperComponent;
