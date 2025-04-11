"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Lote extends Model {
		static associate(models) {
			Lote.associate = (models) => {
				Lote.hasMany(models.Boleto, {
					foreignKey: "id_lote",
					as: "boletos",
				});
			};
		}
	}
	Lote.init(
		{
			nome: DataTypes.STRING,
			ativo: DataTypes.BOOLEAN,
			criado_em: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "Lote",
		}
	);
	return Lote;
};
