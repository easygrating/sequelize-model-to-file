'use strict'
const {
	Model,
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Municipality extends Model {
		static associate (models) {
			Municipality.belongsTo(models.Province, {
				onDelete: 'CASCADE',
				foreignKey: 'province_id'
			})
		}
	}

	Municipality.init({
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		code: {
			type: DataTypes.STRING(2),
			allowNull: false,
		},
		latitude: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		longitude: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	}, {
		sequelize,
		modelName: 'Municipality',
		tableName: 'municipalities',
		underscored: true,
		timestamps: false
	})
	return Municipality
}
