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
			type: DataTypes.STRING,
			allowNull: true,
		},
		longitude: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	}, {
		sequelize,
		modelName: 'Province',
		tableName: 'provinces',
		underscored: true,
		timestamps: false
	})
	return Province
}
