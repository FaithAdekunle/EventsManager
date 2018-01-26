import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import AdminHome from './AdminHomeComponent';
import AdminCenter from './AdminCenterComponent';

class Admin extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/admin" component={AdminHome} />
          <Route exact path="/admin/center/:id" component={AdminCenter} />
          <Redirect from="/admin/*" to="/admin" />
        </Switch>
      </div>
    );
  }
}

export default Admin;
