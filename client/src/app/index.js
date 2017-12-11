import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { render } from 'react-dom';
import AppRouter from './components/AppRouterComponent';

render(<AppRouter />, window.document.getElementById('container'));
