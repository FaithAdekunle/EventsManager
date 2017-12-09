import React from 'react';
import { render } from 'react-dom';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class Home extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello</h1>
      </div>
    );
  }
}

render(<Home />, window.document.getElementById('container'));
