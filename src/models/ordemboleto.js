"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class OrdemBoleto extends Model {
		static associate(models) {

		}
	}
	OrdemBoleto.init(
		{
			nome_sacado: DataTypes.STRING,
			ordem: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "OrdemBoleto",
		}
	);
	return OrdemBoleto;
};
