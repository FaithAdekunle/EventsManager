import React from 'react';

const Home = () => (
  <div>
    <div className="top-section">
      <div className="container">
        <div className="row">
          <div className="col-md-6 homepage-message">
            <h1 className="text-white">Planning an event?</h1>
            <h3 className="text-white">We've got a variety of multipurpose event centers, structured just for what you have in mind.</h3>
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
            <button className="btn btn-primary btn-block see-for-yourself">See for yourself</button>
          </div>
          <div className="col-md-6 col-lg-4 offset-lg-1">
            <div className="card">
              <div className="card-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="fullname">Full name</label>
                    <input type="text" className="form-control" id="fullname" name="fullname" />
                    <label htmlFor="email" className="col-form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" />
                    <label htmlFor="phone" className="col-form-label">Phone number</label>
                    <input type="text" className="form-control" id="phone" name="phone" />
                    <label htmlFor="password" className="col-form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" />
                    <small id="password-help" className="form-text text-muted">At least 8 characters</small>
                    <label htmlFor="confirmPassword" className="col-form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" />
                    <input id="submit" type="submit" className="btn btn-block btn-primary submit-button" value="Sign up to register your event." />
                  </div>
                </form>
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

export default Home;
