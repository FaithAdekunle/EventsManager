import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

class SignIn extends React.Component {
  static propTypes = {
    updateNavTabState: PropTypes.func,
    updateUserState: PropTypes.func,
    history: PropTypes.object,
  }

  constructor() {
    super();
    this.changeFormState = this.changeFormState.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      error: {
        status: false,
        message: null,
      },
    };
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
        const user = {
          fullname: response.data.fullName,
          email: response.data.email,
        };
        localStorage.setItem('appToken', response.data.token);
        this.props.updateUserState(user);
        this.props.updateNavTabState({ isSignedIn: true });
        this.props.history.push('/events');
      })
      .catch((err) => {
        this.changeFormState(false);
        this.form.reset();
        const error = {
          status: true,
          message: err.response ? (Array.isArray(err.response.data.err) ? err.response.data.err[0] : err.response.data.err) : 'Poor network. Check connection',
        };
        this.setState({ error });
        this.alert.classList.remove('hidden');
        setTimeout(() => this.alert.classList.add('hidden'), 10000);
      });
  }

  changeFormState(disabled = true) {
    this.submit.disabled = disabled;
    this.email.disabled = disabled;
    this.password.disabled = disabled;
    if (disabled) return this.spinner.classList.remove('hidden');
    return this.spinner.classList.add('hidden');
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
                  <form onSubmit={this.onSubmit} ref={(input) => { this.form = input; }}>
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
            </div>
            <div className="col-md-2 col-lg-3">
              <div className="alert alert-danger hidden" role="alert" ref={(input) => { this.alert = input; }}>
                {this.state.error.message}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignIn;
