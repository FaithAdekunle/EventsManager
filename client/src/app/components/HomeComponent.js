import React from 'react';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';
import axios from 'axios';

class Home extends React.Component {
  static propTypes = {
    updateAlertState: Proptypes.func,
    history: Proptypes.object,
    alertState: Proptypes.string,
  }

  constructor() {
    super();
    this.changeFormState = this.changeFormState.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.navToCenters = this.navToCenters.bind(this);
    const eventsManager = JSON.parse(localStorage.getItem('eventsManager'));
    this.loginState = eventsManager ? eventsManager.loginState : {
      userIsSignedIn: false,
      userIsAdmin: false,
    };
  }

  onSubmit(event) {
    event.preventDefault();
    if (!this.loginState.userIsSignedIn) {
      if (this.password.value !== this.passwordconfirm.value) {
        this.props.updateAlertState('Password and Confirm Password fields must be equal');
        return setTimeout(() => this.props.updateAlertState(null), 3000);
      }
      this.changeFormState();
      const credentials = {
        fullName: this.fullname.value,
        email: this.email.value,
        password: this.password.value,
        confirmPassword: this.passwordconfirm.value,
      };
      return axios
        .post('http://localhost:7777/api/v1/users', credentials)
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
          this.props.history.push('/events');
        })
        .catch((err) => {
          this.changeFormState(false);
          this.props.updateAlertState(err.response ? (Array.isArray(err.response.data.err) ?
            err.response.data.err[0] : err.response.data.err) : 'Looks like you\'re offline. Check internet connection.');
          setTimeout(() => this.props.updateAlertState(null), 10000);
        });
    }
    this.props.updateAlertState('Log out to create new account');
    return setTimeout(() => this.props.updateAlertState(null), 3000);
  }

  changeFormState(disabled = true) {
    this.form.disabled = disabled;
    if (disabled) return this.spinner.classList.remove('hidden');
    return this.spinner.classList.add('hidden');
  }

  navToCenters() {
    this.props.history.push('/centers');
  }

  render() {
    return (
      <div>
        <div className="top-section">
          <div className="container">
            <div className="row">
              <div className="col-md-6 homepage-message">
                <h1 className="text-white">Planning an event?</h1>
                <h3 className="text-white">We&apos;ve got a variety of multipurpose event centers, structured just for what you have in mind.</h3>
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
                <button className="btn btn-primary btn-block see-for-yourself" onClick={this.navToCenters}>See for yourself</button>
              </div>
              <div className="col-md-6 col-lg-4 offset-lg-1">
                <div className={`alert alert-danger ${!this.props.alertState ? 'no-visible' : ''}`}>
                  {this.props.alertState}
                </div>
                <div className="card">
                  <div className="card-body">
                    <fieldset
                      ref={(input) => { this.form = input; }}
                    >
                      <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                          <label htmlFor="fullname">Full name</label>
                          <input required type="text" ref={(input) => { this.fullname = input; }}className="form-control" id="fullname" name="fullname" />
                          <label htmlFor="email" className="col-form-label">Email address</label>
                          <input required type="email" ref={(input) => { this.email = input; }}className="form-control" id="email" name="email" />
                          <label htmlFor="password" className="col-form-label">Password</label>
                          <input required minLength="8" type="password" ref={(input) => { this.password = input; }} className="form-control" id="password" name="password" />
                          <small id="password-help" className="form-text text-muted">At least 8 characters</small>
                          <label htmlFor="confirmPassword" className="col-form-label">Confirm Password</label>
                          <input required minLength="8" type="password" ref={(input) => { this.passwordconfirm = input; }} className="form-control" id="confirmPassword" name="confirmPassword" />
                          <div className="input-group submit-button">
                            <input id="submit" type="submit" className="btn btn-block btn-primary" value="Sign up to register your event." />
                            <span className="input-group-addon hidden" ref={(input) => { this.spinner = input; }}>
                              <i className="fa fa-spinner fa-spin" aria-hidden="true" />
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
                <img className="card-img-top" src="images/meetings1.jpg" alt="" />
                <div className="card-body">
                  <h4 className="card-title">Meetings</h4>
                  <p className="card-text">Perfect to discuss operational and business strategies.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <img className="card-img-top" src="images/parties.jpg" alt="" />
                <div className="card-body">
                  <h4 className="card-title">Parties</h4>
                  <p className="card-text">Best space for weddings, birthdays and anniversaries.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <img className="card-img-top" src="images/seminars1.jpg" alt="" />
                <div className="card-body">
                  <h4 className="card-title">Seminars</h4>
                  <p className="card-text">Workshops, public lectures and other academic events.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <img className="card-img-top" src="images/outdoor.jpg" alt="" />
                <div className="card-body">
                  <h4 className="card-title">Outdoor events</h4>
                  <p className="card-text">Well decorated open spaces in serene environments.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <img className="card-img-top" src="images/confhall.jpg" alt="" />
                <div className="card-body">
                  <h4 className="card-title">Conferences</h4>
                  <p className="card-text">Gather your colleages to rub minds at our conference halls.</p>
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
            <h5 className="text-white">&#9400; {(new Date()).getFullYear()} Copyright</h5>
          </div>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    alertState: state.alertState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAlertState: (msg) => {
      dispatch({
        type: 'UPDATE_ALERT_STATE',
        payload: msg,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
