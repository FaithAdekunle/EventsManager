// define model for center
module.exports = class CenterModel {
  constructor(sequelize, DataTypes) {
    this.sequelize = sequelize;
    this.DataTypes = DataTypes;
  }

  centerModel() {
    const center = this.sequelize.define('center', {
      name: {
        type: this.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: this.DataTypes.TEXT,
        allowNull: false,
      },
      images: {
        type: this.DataTypes.TEXT,
        allowNull: false,
      },
      facilities: {
        type: this.DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: this.DataTypes.STRING,
        allowNull: false,
      },
      capacity: {
        type: this.DataTypes.INTEGER,
        allowNull: false,
      },
      cost: {
        type: this.DataTypes.INTEGER,
        allowNull: false,
      },
      updatedBy: {
        type: this.DataTypes.INTEGER,
        allowNull: false,
      },
      state: {
        type: this.DataTypes.STRING,
        allowNull: true,
      },
    });
    return center;
  }
};
