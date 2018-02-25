import React from 'react';
import Proptypes from 'prop-types';

class Center extends React.Component {
  static propTypes = {
    center: Proptypes.object,
    history: Proptypes.object,
  }

  constructor() {
    super();
    this.increaseNameSize = this.increaseNameSize.bind(this);
    this.decreaseNameSize = this.decreaseNameSize.bind(this);
    this.navToCenter = this.navToCenter.bind(this);
  }

  increaseNameSize() {
    this.centerName.classList.add('hover');
  }

  decreaseNameSize() {
    this.centerName.classList.remove('hover');
  }

  navToCenter() {
    this.props.history.push(`/centers/${this.props.center.id}`);
  }

  render() {
    const { center } = this.props;
    return (
      <div className="container">
        <div className="center-container">
          <div className="row">
            <div className="col-lg-7">
              <span
                className="center-name"
                ref={(input) => { this.centerName = input; }}
                onMouseEnter={this.increaseNameSize}
                onMouseLeave={this.decreaseNameSize}
                onClick={this.navToCenter}
              ><strong>{center.name}</strong>
              </span>
            </div>
            <div className="col-lg-5">
              <span className="pull-right center-location"><i className="fa fa-map-marker" aria-hidden="true" /><strong> {center.address}</strong></span>
            </div>
            <div className="col-lg-6">
              <div
                className="card center-card"
              >
                <img
                  className="center-image"
                  onMouseEnter={this.increaseNameSize}
                  onMouseLeave={this.decreaseNameSize}
                  onClick={this.navToCenter}
                  src={`http://localhost:7777/images/${center.images[0]}`}
                  width="100%"
                  alt={center.name}
                />
                <div className="card-body">
                  <div className="row">
                    <div className="col-12">
                      {center.facilities.map((facility) => {
                        return (
                          <span className="badge badge-primary badge-pill" key={facility}>{facility}</span>
                        );
                      })}
                    </div>
                    <div className="col-6"><span>Capacity: <strong>{center.capacity}</strong></span></div>
                    <div className="col-6"><span>Price: <strong>#{center.cost}</strong></span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="description"><p className="text-justify">{center.description}</p></div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    );
  }
}

export default Center;
