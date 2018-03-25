import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import UserModel from './models/userModel';
import EventModel from './models/eventModel';
import CenterModel from './models/centerModel';

dotenv.config({ path: '.env' });

class Database {
  constructor() {
    this.Sequelize = Sequelize;
    const mode = process.env.NODE_ENV || 'development';
    let database;
    if (mode === 'test') {
      database = process.env.TEST_DATABASE;
    } else if (mode === 'development') {
      database = process.env.DEV_DATABASE;
    } else {
      database = process.env.PROD_DATABASE;
    }
    this.sequelize = new this.Sequelize(database);
    const userModel = new UserModel(this.sequelize, this.Sequelize);
    const eventModel = new EventModel(this.sequelize, this.Sequelize);
    const centerModel = new CenterModel(this.sequelize, this.Sequelize);
    this.db_user = userModel.userModel();
    this.db_event = eventModel.eventModel();
    this.db_center = centerModel.centerModel();
  }

  // confirm connection with database
  authenticate() {
    this.sequelize
      .authenticate()
      .then(() => {})
      .catch();
  }

  // set up model associations
  setUp() {
    this.db_user.hasMany(this.db_event, { allowNull: false });
    this.db_center.hasMany(this.db_event, { allowNull: false });
    this.db_user.hasMany(this.db_center, {
      foreignKey: {
        name: 'createdBy',
        allowNull: false,
      },
    });
  }

  // synchronize models with database
  sync() {
    this.sequelize
      .sync()
      .then(() => {})
      .catch();
  }

  get user() {
    return this.db_user;
  }

  get center() {
    return this.db_center;
  }

  get event() {
    return this.db_event;
  }
}

module.exports = new Database();
