import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import OtherActions from '../../actions/others';

/**
 * SignIn component class
 */
class SignUp extends React.Component {
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
    this.navToSignin = this.navToSignin.bind(this);
    this.onSignupFail = this.onSignupFail.bind(this);
    this.onSignupSuccessful = this.onSignupSuccessful.bind(this);
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
  onSignupSuccessful() {
    this.props.history.push('/events');
  }

  /**
   * executes after failed login attempt
   * @param { object } response
   * @returns { void }
   */
  onSignupFail(response) {
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
   * creates new user
   * @param { object } event
   * @returns { void }
   */
  onSubmit(event) {
    event.preventDefault();
    if (this.password.value !== this.passwordconfirm.value) {
      OtherActions
        .updateAlertState('Password and Confirm Password fields must be equal');
      return setTimeout(() => OtherActions.updateAlertState(null), 3000);
    }
    this.changeFormState();
    const credentials = {
      fullName: this.fullname.value,
      email: this.email.value,
      password: this.password.value,
      confirmPassword: this.passwordconfirm.value,
    };
    return OtherActions
      .signup(credentials, this.onSignupSuccessful, this.onSignupFail);
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
   * navigates to signin page
   * @returns { void }
   */
  navToSignin() {
    this.props.history.push('/signin');
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
                    Sign up to register your events.
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
                        <label htmlFor="fullname" className="col-form-label">
                          Fullname
                        </label>
                        <input
                          required
                          type="text"
                          className="form-control"
                          id="fullname"
                          ref={(input) => { this.fullname = input; }}
                        />
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
                        <label
                          htmlFor="passwordconfirm"
                          className="col-form-label"
                        >
                          Confirm Password
                        </label>
                        <input
                          required
                          type="password"
                          className="form-control"
                          id="passwordconfirm"
                          minLength="8"
                          maxLength="20"
                          ref={(input) => { this.passwordconfirm = input; }}
                        />
                        <input
                          type="submit"
                          className="btn btn-block btn-outline-primary
                          submit-button"
                          defaultValue="Sign up"
                          ref={(input) => { this.submit = input; }}
                        />
                      </div>
                    </form>
                  </fieldset>
                </div>
              </div>
              <div className="redirect">
                <a className="navTo redirect-to" onClick={this.navToSignin}>
                  Already have an account? Sign in here.
                </a>
              </div>
            </div>
            <div className="col-md-2 col-lg-3">
              <div
                className={`alert alert-danger ${!this.props.alertState ?
                'hidden' : ''}`}
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

export default connect(mapStateToProps)(SignUp);
