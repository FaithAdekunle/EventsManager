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
      <React.Fragment>
        <span
          className="center-name"
          ref={(input) => { this.centerName = input; }}
          onClick={this.navToCenter}
        ><strong>{center.name}</strong>
        </span>
        <div className="card center-card">
          <img
            className="center-image"
            onClick={this.navToCenter}
            src={center.images[0]}
            width="100%"
            alt={center.name}
          />
          <div className="center-preview">
            <div className="name-and-location">
              <span className="center-detail"><i className="fa fa-map-marker" aria-hidden="true" /><strong> {center.address}</strong></span>
              <span className="center-detail"><strong> {center.capacity} guests</strong></span>
            </div>
            {center.facilities.map((facility) => {
              return (
                <span className="badge badge-primary badge-pill" key={facility}>{facility}</span>
              );
            })}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Center;
