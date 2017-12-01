import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import UserModel from './models/userModel';
import EventModel from './models/eventModel';
import CenterModel from './models/centerModel';

dotenv.config({ path: '.env' });

class Database {
  constructor() {
    this.Sequelize = Sequelize;
    this.sequelize = new this.Sequelize(process.env.DATABASE);
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
      .sync({ force: true })
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
