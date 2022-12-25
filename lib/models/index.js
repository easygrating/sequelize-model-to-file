'use strict'

const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('../../config/sequelize.config.js')[env]
const { getFiles } = require('../services/utils/loadConfigs.service')
const db = {}

let sequelize
if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
	sequelize = new Sequelize(config.database, config.username, config.password, config)
}

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
