'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Posts, {
        sourceKey: "postId",
        foreignKey: "postId",
        onDelete: "CASCADE",
      });
    }
  }
  Tags.init({
    postId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Posts",
        key: "postId",
      },
      onDelete: "CASCADE",
    },
    tagName: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Tags',
    timestamps: false,
  });
  Tags.removeAttribute('id');
  return Tags;
};