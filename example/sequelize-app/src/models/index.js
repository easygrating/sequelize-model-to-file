'use strict'

const Sequelize = require('sequelize')
const { getFiles } = require('../services/loadConfigs.service')
const db = {}

let sequelize = new Sequelize({ dialect: 'sqlite' });

getFiles(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== __filename) && (file.slice(-3) === '.js')
	}).forEach(file => {
		const model = require(file)(sequelize, Sequelize.DataTypes)
		db[model.name] = model
	})

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db)
		!!db[modelName].applyHooks && db[modelName].applyHooks(db)
	}
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
