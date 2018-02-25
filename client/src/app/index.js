import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/scss/font-awesome.scss';
import 'font-awesome-loader';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import './index.sass';
import App from './components/AppComponent';
import { store } from './components/StoreComponent';

render(<Provider store={store}><App /></Provider>, window.document.getElementById('container'));
