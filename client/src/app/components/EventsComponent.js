import React from 'react';
import Event from './EventComponent';

class Events extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-6">
          <Event />
        </div>
        <div className="col-6">
          <Event />
        </div>
        <div className="col-6">
          <Event />
        </div>
        <div className="col-6">
          <Event />
        </div>
      </div>
    );
  }
}

export default Events;
