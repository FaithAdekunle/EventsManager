import { BrowserRouter, Route } from 'react-router-dom';
import React from 'react';
import App from './AppComponent';

const AppRouter = () => (
  <BrowserRouter>
    <Route path="/" component={App} />
  </BrowserRouter>
);

export default AppRouter;
