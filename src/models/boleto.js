"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Boleto extends Model {
		static associate(models) {
			Boleto.associate = (models) => {
				Boleto.belongsTo(models.Lote, {
					foreignKey: "id_lote",
					as: "lote",
				});
			};
		}
	}
	Boleto.init(
		{
			nome_sacado: DataTypes.STRING,
			id_lote: DataTypes.INTEGER,
			valor: DataTypes.DECIMAL,
			linha_digitavel: DataTypes.STRING,
			ativo: DataTypes.BOOLEAN,
			criado_em: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "Boleto",
		}
	);
	return Boleto;
};
