import express from 'express';
import logger from 'morgan';
import swaggerTools from 'swagger-tools';
import bodyParser from 'body-parser';
import AppRouter from './routes/index';
import swaggerDoc from './openapi.json';

const options = {
  controllers: './server/dist/controllers',
  useStubs: process.env.NODE_ENV === 'development',
};


module.exports = class App {
  static getApp() {
    const app = express();
    swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
      app.use(middleware.swaggerMetadata());
      app.use(middleware.swaggerValidator());
      app.use(middleware.swaggerRouter(options));
      app.use(middleware.swaggerUi());
    });
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use('/', AppRouter.Router());
    return app;
  }
};
