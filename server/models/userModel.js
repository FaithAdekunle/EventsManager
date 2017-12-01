// define model for user
module.exports = class UserModel {
  constructor(sequelize, DataTypes) {
    this.sequelize = sequelize;
    this.DataTypes = DataTypes;
  }

  userModel() {
    const user = this.sequelize.define('user', {
      fullName: {
        type: this.DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: this.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: this.DataTypes.STRING,
        allowNull: false,
      },
      isAdmin: {
        type: this.DataTypes.BOOLEAN,
        defaultValue: false,
      },

    });
    return user;
  }
};
