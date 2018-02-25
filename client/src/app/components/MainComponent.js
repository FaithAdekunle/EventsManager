import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import Home from './HomeComponent';
import EventCenters from './Center/EventCentersComponent';
import Signin from './Sign/SigninComponent';
import Signup from './Sign/SignupComponent';
import Admin from './Admin/AdminComponent';
import UserEvents from './Event/UserEventsComponent';

class Main extends React.Component {
  render() {
    const eventsManager = JSON.parse(localStorage.getItem('eventsManager'));
    const loginState = eventsManager ? eventsManager.loginState : {
      userIsSignedIn: false,
      userIsAdmin: false,
    };
    const { userIsSignedIn, userIsAdmin } = loginState;
    return (
      <div>
        <Switch>
          <Route
            exact
            path="/home"
            render={props => (
                userIsSignedIn ? (
                  <Redirect to={`${userIsAdmin ? '/admin' : '/events'}`} />
                ) : (
                  <Home {...props} />
                )
              )
            }
          />
          <Route
            exact
            path="/signin"
            render={props => (
                userIsSignedIn ? (
                  <Redirect to={`${userIsAdmin ? '/admin' : '/events'}`} />
                ) : (
                  <Signin {...props} />
                )
              )
            }
          />
          <Route
            exact
            path="/signup"
            render={props => (
                userIsSignedIn ? (
                  <Redirect to={`${userIsAdmin ? '/admin' : '/events'}`} />
                ) : (
                  <Signup {...props} />
                )
              )
            }
          />
          <Route
            path="/admin"
            render={props => (
                userIsAdmin ? (
                  <Admin {...props} />
                ) : (
                  <Redirect to="/signin" />
                )
              )
            }
          />
          <Route
            path="/events"
            render={props => (
                userIsSignedIn && !userIsAdmin ? (
                  <UserEvents {...props} />
                ) : (
                  <Redirect to="/signin" />
                )
              )
            }
          />
          <Route
            path="/centers"
            component={EventCenters}
          />
          <Redirect from="*" to="/home" />
        </Switch>
      </div>
    );
  }
}

export default Main;
