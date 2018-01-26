import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import path from 'path';
import swaggerTools from 'swagger-tools';
import bodyParser from 'body-parser';
import AppRouter from './routes/index';
import swaggerDoc from './openapi.json';
import database from './db';

const options = {
  controllers: './server/dist/controllers',
  useStubs: true,
};


module.exports = class App {
  static setUp() {
    database.authenticate();
    database.setUp();
    database.sync();
    const app = express();
    app.use(cors());
    swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
      app.use(middleware.swaggerMetadata());
      app.use(middleware.swaggerValidator());
      app.use(middleware.swaggerRouter(options));
      app.use(middleware.swaggerUi());
    });
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/', AppRouter.Router());
    return app;
  }
};
