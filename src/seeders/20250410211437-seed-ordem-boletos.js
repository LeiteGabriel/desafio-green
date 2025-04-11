"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("OrdemBoletos", [
            { nome_sacado: "MARCIA", ordem: 1, createdAt: new Date(), updatedAt: new Date() },
            { nome_sacado: "JOSE", ordem: 2, createdAt: new Date(), updatedAt: new Date() },
            { nome_sacado: "MARCOS", ordem: 3, createdAt: new Date(), updatedAt: new Date() },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("OrdemBoletos", null, {});
    },
};