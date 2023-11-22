'use strict'
const {
	Model,
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Province extends Model {
		static associate (models) {
			Province.hasMany(models.Municipality, { foreignKey: 'province_id' })
		}
	}

	Province.init({
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		code: {
			type: DataTypes.STRING(2),
			allowNull: false,
		},
		latitude: {
			type: DataTypes.DECIMAL(8,6),
			allowNull: true,
		},
		longitude: {
			type: DataTypes.DECIMAL(8,6),
			allowNull: true,
		},
		createdAt: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
	}, {
		sequelize,
		modelName: 'Province',
		tableName: 'provinces',
		underscored: true
	})
	return Province
}
