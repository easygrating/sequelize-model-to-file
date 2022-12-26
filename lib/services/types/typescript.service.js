const { mapValues } = require('lodash')

/**
 * Create an string of a TypeScript class
 * @param {*} model the sequelize model
 * @param {*} modelname the name of the model 
 * @returns the class to write in the file
 */
function buildTypeScript(model, modelname) {
    let schema = mapValues(model.rawAttributes, item => {
        return getTSDataType(item.type.constructor.name)
    })
    let associations = mapValues(model.associations, item => {
        if (item.isMultiAssociation)
            return item.target.name + '[]'
        return item.as
    })
    return getTSClass(modelname, schema, associations)
}

/**
* Builds the TypeScript class to write in the file
* @param {*} modelname the name of the model to be use as the class name
* @param {*} schema the field names and types
* @param {*} associations the relations of the model
* @returns the class in string format
*/
function getTSClass(modelname, schema, associations) {
    let jsonString = JSON
        .stringify(Object.assign({}, schema, associations), null, ' ')
        .replace(/,/g, ';')
        .replace(/\"\n/g, ';\n')
        .replace(/\"/g, '')
    jsonString = 'export class ' + modelname + ' ' + jsonString
    return jsonString
}

/**
 * Util method to return the equivalent data types from Sequelize types to TypeScript types
 * @param {*} type sequelize field's type 
 * @returns the equivalent TypeScript type
 */
function getTSDataType(type) {
    switch (type) {
        case 'INTEGER':
        case 'DECIMAL':
        case 'DOUBLE':
        case 'FLOAT':
            return 'number'
        case 'DATE':
        case 'DATEONLY':
            return 'Date'
        case 'BOOLEAN':
            return 'boolean'
        case 'STRING':
        case 'TEXT':
            return 'string'
    }
}

module.exports = { buildTypeScript: buildTypeScript }