module.exports = class EventModel {
  constructor(sequelize, DataTypes) {
    this.sequelize = sequelize;
    this.DataTypes = DataTypes;
  }

  eventModel() {
    const event = this.sequelize.define('event', {
      name: {
        type: this.DataTypes.STRING,
        allowNull: false,
      },
      start: {
        type: this.DataTypes.STRING,
        allowNull: false,
      },
      end: {
        type: this.DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: this.DataTypes.STRING,
        allowNull: false,
      },
      guests: {
        type: this.DataTypes.INTEGER,
        allowNull: false,
      },
      days: {
        type: this.DataTypes.INTEGER,
        allowNull: false,
      },
      isValid: {
        type: this.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });
    return event;
  }
};
