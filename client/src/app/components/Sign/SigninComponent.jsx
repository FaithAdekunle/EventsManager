import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import OtherActions from '../../actions/otherActions';

/**
 * SignIn component class
 */
class SignIn extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    alertState: PropTypes.string,
  }

  /**
   * constructor
   */
  constructor() {
    super();
    this.changeFormState = this.changeFormState.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.navToSignup = this.navToSignup.bind(this);
    this.onUserLoginFail = this.onUserLoginFail.bind(this);
    this.onUserLoginSuccessful = this.onUserLoginSuccessful.bind(this);
  }

  /**
   * executes before component unmounts
   * @returns { void }
   */
  componentWillUnmount() {
    OtherActions.updatePageState({
      userOnSignInPage: false,
      userOnSignUpPage: false,
    });
    OtherActions.updateAlertState(null);
  }

  /**
   * executes after user logs in succesfully
   * @param { object } response
   * @returns { void }
   */
  onUserLoginSuccessful() {
    this.props.history.push('/events');
  }

  /**
   * executes after failed login attempt
   * @param { object } response
   * @returns { void }
   */
  onUserLoginFail(response) {
    this.changeFormState(false);
    if (!response) {
      return OtherActions
        .updateAlertState(`Looks like you're offline. 
        Check internet connection.`);
    }
    OtherActions.updateAlertState(Array.isArray(response.data.error) ?
      response.data.error[0] : response.data.error);
    return setTimeout(() => OtherActions.updateAlertState(null), 10000);
  }

  /**
   * signs user in
   * @param { object } event
   * @returns { void }
   */
  onSubmit(event) {
    event.preventDefault();
    this.changeFormState();
    const credentials = {
      email: this.email.value,
      password: this.password.value,
    };
    OtherActions
      .login(credentials, this.onUserLoginSuccessful, this.onUserLoginFail);
  }

  /**
   * called in submit user
   * @param { boolean } disabled
   * @returns { void }
   */
  changeFormState(disabled = true) {
    this.fieldset.disabled = disabled;
    if (disabled) return this.spinner.classList.remove('hidden');
    return this.spinner.classList.add('hidden');
  }

  /**
   * navigates to signup page
   * @returns { void }
   */
  navToSignup() {
    this.props.history.push('/signup');
  }

  /**
   * renders component in browser
   * @returns { component } to be rendered on the page
   */
  render() {
    return (
      <div className="form-page">
        <div className="container">
          <div className="row" id="form-row">
            <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
              <div className="card">
                <div className="card-header">
                  <h2>
                    Sign in to manage your events and more
                    <i
                      className="fa fa-spinner fa-spin hidden"
                      ref={(input) => { this.spinner = input; }}
                      aria-hidden="true"
                    />
                  </h2>
                </div>
                <div className="card-body">
                  <fieldset ref={(input) => { this.fieldset = input; }}>
                    <form onSubmit={this.onSubmit}>
                      <div className="form-group">
                        <label htmlFor="email" className="col-form-label">
                          Email address
                        </label>
                        <input
                          required
                          type="email"
                          className="form-control"
                          id="email"
                          ref={(input) => { this.email = input; }}
                        />
                        <label htmlFor="password" className="col-form-label">
                          Password
                        </label>
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
                          className="btn btn-block btn-outline-primary
                          submit-button"
                          defaultValue="Sign in"
                          ref={(input) => { this.submit = input; }}
                        />
                      </div>
                    </form>
                  </fieldset>
                </div>
              </div>
              <div className="redirect">
                <a className="navTo redirect-to" onClick={this.navToSignup}>
                  New here? Sign up for a new account.
                </a>
              </div>
            </div>
            <div className="col-md-2 col-lg-3">
              <div
                className={`alert alert-danger 
                ${!this.props.alertState ? 'hidden' : ''}`}
              >
                {this.props.alertState}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ alertState: state.alertState });

export default connect(mapStateToProps)(SignIn);
