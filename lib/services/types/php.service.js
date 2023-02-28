const { readFileSync } = require('fs')
const { forEach, template, upperFirst, camelCase, lowerFirst } = require('lodash')
const { resolve } = require('path')

/**
 * Create an string of a PHP class
 * @param {*} model the sequelize model
 * @param {*} modelname the name of the model
 * @returns the class to write in the file
 */
function buildPHP (model, modelname) {
	const templateFile = readFileSync(
		resolve(__dirname, '../../templates/php.template')
	)

	const properties = processAttributes(model)
	const props = { className: modelname, properties }

	const compile = template(templateFile)
	return compile(props)
}

/**
 * Process model attributes and generates a template properties
 * @param {*} model the sequelize model
 * @returns the template properties of the given model
 */
function processAttributes (model) {
	const properties = []
	forEach(model.rawAttributes, (value, key) => {
		const type = processType(value.type.constructor.name)

		const name = camelCase(key)
		const upperFirstName = upperFirst(name)
		properties.push({
			type,
			name,
			allowNull: !!value.allowNull ? '?' : '',
			getName: `get${upperFirstName}`,
			setName: `set${upperFirstName}`
		})
	})

	forEach(model.associations, (item) => {
		const upperFirstName = upperFirst(item.as)
		properties.push({
			type: item.isMultiAssociation ? 'array' : item.as,
			name: lowerFirst(item.as),
			allowNull: '',
			getName: `get${upperFirstName}`,
			setName: `set${upperFirstName}`
		})
	})
	return properties
}

/**
 * Util method to return the equivalent data types from Sequelize types to Php types
 * @param {*} type sequelize field's type
 * @returns {string} a string with the php type
 */
function processType (type) {
	switch (type) {
		case 'INTEGER':
			return 'int'
		case 'DECIMAL':
		case 'DOUBLE':
		case 'FLOAT':
			return 'float'
		case 'STRING':
		case 'TEXT':
			return 'string'
		case 'DATE':
		case 'DATEONLY':
			return 'DateTime'
		case 'BOOLEAN':
			return 'bool'
		default:
			return 'void'
	}
}

module.exports = { buildPHP: buildPHP }
