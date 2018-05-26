import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/scss/font-awesome.scss';
import 'rc-pagination/assets/index.css';
import 'font-awesome-loader';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import '../style/index.sass';
import AppComponent from './components/AppComponent.jsx';
import store from './Reducers';

render(
  <Provider store={store}><AppComponent /></Provider>,
  window.document.getElementById('container'),
);
