import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

class SignIn extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    alertState: PropTypes.string,
    loginState: PropTypes.object,
    updateUserState: PropTypes.func,
    updateLoginState: PropTypes.func,
    updateAlertState: PropTypes.func,
    updatePageState: PropTypes.func,
  }

  constructor() {
    super();
    this.changeFormState = this.changeFormState.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.navToSignup = this.navToSignup.bind(this);
  }

  componentDidMount() {
    const { loginState, history, updatePageState } = this.props;
    if (loginState.userIsSignedIn) {
      if (loginState.userIsAdmin) history.push('/admin');
      else { history.push('/events'); }
    } else {
      updatePageState({
        userOnSignInPage: true,
        userOnSignUpPage: false,
      });
    }
  }

  componentWillUnmount() {
    this.props.updatePageState({
      userOnSignInPage: false,
      userOnSignUpPage: false,
    });
    this.props.updateAlertState(null);
  }

  onSubmit(event) {
    event.preventDefault();
    this.changeFormState();
    const credentials = {
      email: this.email.value,
      password: this.password.value,
    };
    axios
      .post('http://andela-events-manager.herokuapp.com/api/v1/users/login', credentials)
      .then((response) => {
        const userState = {
          fullname: response.data.fullName,
          email: response.data.email,
        };
        const loginState = {
          userIsSignedIn: true,
          userIsAdmin: response.data.isAdmin,
        };
        const eventsManager = {
          appToken: response.data.token,
          userState,
          loginState,
        };
        localStorage.setItem('eventsManager', JSON.stringify(eventsManager));
        this.props.updateUserState(userState);
        this.props.updateLoginState(loginState);
        this.props.history.push('/events');
      })
      .catch((err) => {
        this.changeFormState(false);
        this.props.updateAlertState(err.response ? (Array.isArray(err.response.data.err) ?
          err.response.data.err[0] : err.response.data.err) : 'Looks like you\'re offline. Check internet connection.');
        setTimeout(() => this.props.updateAlertState(null), 10000);
      });
  }

  changeFormState(disabled = true) {
    this.submit.disabled = disabled;
    this.email.disabled = disabled;
    this.password.disabled = disabled;
    if (disabled) return this.spinner.classList.remove('hidden');
    return this.spinner.classList.add('hidden');
  }

  navToSignup() {
    this.props.history.push('/signup');
  }

  render() {
    return (
      <div className="form-page">
        <div className="container">
          <div className="row" id="form-row">
            <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
              <div className="card">
                <div className="card-header">
                  <h2>Sign in to manage your events and more <i className="fa fa-spinner fa-spin hidden" ref={(input) => { this.spinner = input; }} aria-hidden="true" /></h2>
                </div>
                <div className="card-body">
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <label htmlFor="email" className="col-form-label">Email address</label>
                      <input
                        required
                        type="email"
                        className="form-control"
                        id="email"
                        ref={(input) => { this.email = input; }}
                      />
                      <label htmlFor="password" className="col-form-label">Password</label>
                      <input
                        required
                        type="password"
                        className="form-control"
                        id="password"
                        minLength="8"
                        maxLength="20"
                        ref={(input) => { this.password = input; }}
                      />
                      <input
                        type="submit"
                        className="btn btn-block btn-outline-primary submit-button"
                        defaultValue="Sign in"
                        ref={(input) => { this.submit = input; }}
                      />
                    </div>
                  </form>
                </div>
              </div>
              <div className="redirect">
                <a className="navTo" onClick={this.navToSignup}>New here? Sign up for a new account.</a>
              </div>
            </div>
            <div className="col-md-2 col-lg-3">
              <div className={`alert alert-danger ${!this.props.alertState ? 'hidden' : ''}`}>
                {this.props.alertState}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loginState: state.loginState,
    alertState: state.alertState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateLoginState: (loginState) => {
      dispatch({
        type: 'UPDATE_LOGIN_STATE',
        payload: loginState,
      });
    },
    updateUserState: (userState) => {
      dispatch({
        type: 'UPDATE_USER_STATE',
        payload: userState,
      });
    },
    updateAlertState: (msg) => {
      dispatch({
        type: 'UPDATE_ALERT_STATE',
        payload: msg,
      });
    },
    updatePageState: (pageState) => {
      dispatch({
        type: 'UPDATE_PAGE_STATE',
        payload: pageState,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
