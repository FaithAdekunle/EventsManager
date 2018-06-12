import React from 'react';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';
import DialApi from './../DialApi';
import OtherActions from './../actions/OtherActions';
import constants from '../constants';

/**
 * Home component class
 */
export class HomePageComponent extends React.Component {
  static propTypes = {
    history: Proptypes.object,
    alert: Proptypes.string,
    token: Proptypes.string,
  }

  /**
   * constructor
   */
  constructor() {
    super();
    this.changeFormState = this.changeFormState.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.navToCenters = this.navToCenters.bind(this);
    this.beforeSignUp = this.beforeSignUp.bind(this);
    this.onSignupFail = this.onSignupFail.bind(this);
    this.onSignupSuccessful = this.onSignupSuccessful.bind(this);
  }

  /**
   * executes after component mounts
   * @returns { void }
   */
  componentDidMount() {
    scrollTo(0, 0);
  }

  /**
   * executes before component unmounts
   * @returns { void }
   */
  componentWillUnmount() {
    OtherActions.setAlert(null);
  }

  /**
   * executes after user signs in succesfully
   * @param { object } response
   * @returns { void }
   */
  onSignupSuccessful(response) {
    OtherActions.setToken(response.token);
    this.props.history.push('/events');
  }

  /**
   * executes after failed signin attempt
   * @param { object } response
   * @returns { void }
   */
  onSignupFail(response) {
    this.changeFormState(false);
    if (!response) {
      OtherActions
        .setAlert(constants.NO_CONNECTION);
    } else {
      OtherActions.setAlert(Array.isArray(response.data.error) ?
        response.data.error[0] : response.data.error);
    }
  }

  /**
   * creates new user
   * @param { object } event
   * @returns { void }
   */
  onSubmit(event) {
    event.preventDefault();
    const credentials = {
      fullName: this.fullname.value,
      email: this.email.value,
      password: this.password.value,
      confirmPassword: this.passwordconfirm.value,
    };
    if (credentials.password !== credentials.confirmPassword) {
      return OtherActions
        .setAlert(constants.PASSWORD_MISMATCH);
    }
    return DialApi
      .signup(
        this.beforeSignUp,
        credentials,
        this.onSignupSuccessful,
        this.onSignupFail,
      );
  }

  /**
   * executes before signup
   * @returns { void }
   */
  beforeSignUp() {
    this.changeFormState();
  }

  /**
   * called in submit user
   * @param { boolean } disabled
   * @returns { void }
   */
  changeFormState(disabled = true) {
    this.form.disabled = disabled;
    if (disabled) return this.spinner.classList.remove('hidden');
    return this.spinner.classList.add('hidden');
  }

  /**
   * navigates to centers page
   * @returns { void }
   */
  navToCenters() {
    this.props.history.push('/centers');
  }

  /**
   * renders component in browser
   * @returns { component } to be rendered on the page
   */
  render() {
    return (
      <React.Fragment>
        <div className="top-section">
          <div className="container">
            <div className="row">
              <div className="col-md-6 homepage-message">
                <h1 className="text-white">Planning an event?</h1>
                <h3 className="text-white">
                  We&apos;ve got a variety of multipurpose event centers,
                   structured just for what you have in mind.
                </h3>
                <div className="row homepage-highlights">
                  <div className="col-lg border-me">
                    <div className="text-center">
                      <h3 className="text-white">Quality Facilities</h3>
                    </div>
                  </div>
                  <div className="col-lg border-me">
                    <div className="text-center">
                      <h3 className="text-white">Great Locations</h3>
                    </div>
                  </div>
                  <div className="col-lg">
                    <div className="text-center">
                      <h3 className="text-white">Affordable Prices</h3>
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-primary btn-block see-for-yourself"
                  onClick={this.navToCenters}
                >
                  See for yourself
                </button>
              </div>
              <div className="col-md-6 col-lg-4 offset-lg-1 home-page-signup">
                <div className="card">
                  <div className="card-header">
                    <h6>Signup to start booking centers</h6>
                    <div
                      className={this.props.alert ?
                        'form-error' : 'no-visible'}
                    >
                      {this.props.alert}
                    </div>
                  </div>
                  <div className="card-body">
                    <fieldset
                      ref={(input) => { this.form = input; }}
                      disabled={this.props.token}
                    >
                      <form id="signUpForm" onSubmit={this.onSubmit}>
                        <div className="form-group">
                          <label htmlFor="fullname">Full name</label>
                          <input
                            // required
                            type="text"
                            ref={(input) => { this.fullname = input; }}
                            className="form-control"
                            id="fullname"
                            name="fullname"
                          />
                          <label htmlFor="email" className="col-form-label">
                            Email address
                          </label>
                          <input
                            // required
                            type="email"
                            ref={(input) => { this.email = input; }}
                            className="form-control"
                            id="email"
                            name="email"
                          />
                          <label htmlFor="password" className="col-form-label">
                            Password
                          </label>
                          <input
                            // required
                            minLength="8"
                            type="password"
                            ref={(input) => { this.password = input; }}
                            className="form-control"
                            id="password"
                            name="password"
                          />
                          <small
                            id="password-help"
                            className="form-text text-muted"
                          >
                            At least 8 characters
                          </small>
                          <label
                            htmlFor="confirmPassword"
                            className="col-form-label"
                          >
                            Confirm Password
                          </label>
                          <input
                            required
                            minLength="8"
                            type="password"
                            ref={(input) => { this.passwordconfirm = input; }}
                            className="form-control"
                            id="confirmPassword"
                            name="confirmPassword"
                          />
                          <div className="input-group submit-button">
                            <input
                              id="submit"
                              type="submit"
                              className="btn btn-block btn-primary"
                              value="Sign up"
                            />
                            <span
                              className="input-group-addon hidden"
                              ref={(input) => { this.spinner = input; }}
                            >
                              <i
                                className="fa fa-spinner fa-spin"
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                        </div>
                      </form>
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container body-section">
          <h1 className="text-center"><b>For your type of event...</b></h1>
          <div className="row">
            <div className="col-md-4">
              <div className="card">
                <img
                  className="card-img-top"
                  src="images/meetings1.jpg"
                  alt=""
                />
                <div className="card-body">
                  <h4 className="card-title">Meetings</h4>
                  <p className="card-text">
                    Perfect to discuss operational and business strategies.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <img className="card-img-top" src="images/parties.jpg" alt="" />
                <div className="card-body">
                  <h4 className="card-title">Parties</h4>
                  <p className="card-text">
                    Best space for weddings, birthdays and anniversaries.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <img
                  className="card-img-top"
                  src="images/seminars1.jpg"
                  alt=""
                />
                <div className="card-body">
                  <h4 className="card-title">Seminars</h4>
                  <p className="card-text">
                    Workshops, public lectures and other academic events.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <img className="card-img-top" src="images/outdoor.jpg" alt="" />
                <div className="card-body">
                  <h4 className="card-title">Outdoor events</h4>
                  <p className="card-text">
                    Well decorated open spaces in serene environments.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <img
                  className="card-img-top"
                  src="images/confhall.jpg"
                  alt=""
                />
                <div className="card-body">
                  <h4 className="card-title">Conferences</h4>
                  <p className="card-text">
                    Gather your colleages to rub minds at our conference halls.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 and-more">
              <h1 className="text-center">...and more</h1>
            </div>
          </div>
        </div>
        <footer id="myFooter">
          <div className="footer-copyright">
            <h5 className="text-white">
              &#9400; {(new Date()).getFullYear()} Copyright
            </h5>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  alert: state.alert,
  token: state.token,
});

export default connect(mapStateToProps)(HomePageComponent);
