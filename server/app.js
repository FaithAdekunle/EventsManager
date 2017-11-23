import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';

export class App {

  setApp(){
    const app = express();
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    return app;
  }

}
