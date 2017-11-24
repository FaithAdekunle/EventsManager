import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import { AppRouter }  from './routes/index';

export class App {

  static getApp(){
    const app = express();
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use('/', AppRouter.Router());
    return app;
  }

}
