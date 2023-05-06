"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Comments extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

            this.belongsTo(models.Users, {
                targetKey: "userId",
                foreignKey: "UserId",
                onDelete: "CASCADE",
            });

            this.belongsTo(models.Posts, {
                targetKey: "postId",
                foreignKey: "PostId",
                onDelete: "CASCADE",
            });
        }
    }
    Comments.init(
        {
            commentId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            UserId: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            PostId: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            comment: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            nickname: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
        },
        {
            sequelize,
            modelName: "Comments",
        }
    );
    return Comments;
};
