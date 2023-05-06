module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("Comments", "nickname", {
            allowNull: false,
            type: Sequelize.STRING,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn("users", "new_column");
    },
};
