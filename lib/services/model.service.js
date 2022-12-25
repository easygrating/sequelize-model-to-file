const { mapValues } = require('lodash')
const path = require('path');
const fs = require('fs');
const { INVALID_MODEL_ERROR } = require('../constants/messages.constants');
const defaults = {
    basePath: path.resolve('./'),
    exportFolder: '/sequelizeModels'
}

/**
 * Creates a class file based on a sequelize model fields
 * @param {*} argv the user input arguments in command line
 * @param {*} sequelizePath the path to sequelize models folder
 */
function exportModel(argv, sequelizePath) {
    const db = require(sequelizePath)
    const modelname = argv?.model || argv?.m
    let extension = argv?.extension || argv?.e || 'ts'

    extension = extension.replace(/\./, '')
    if (!modelname || !db.hasOwnProperty(modelname))
        throw new Error(INVALID_MODEL_ERROR)
    const model = db[modelname]
    let schema = mapValues(model.rawAttributes, item => {
        return getTSDataType(item.type.constructor.name)
    })

    let associations = mapValues(model.associations, item => {
        if (item.isMultiAssociation)
            return item.target.name + '[]'
        return item.as
    })
    let jsonString = JSON
        .stringify(Object.assign({}, schema, associations), null, ' ')
        .replace(/,/g, ';')
        .replace(/\"\n/g, ';\n')
        .replace(/\"/g, '')
    jsonString = 'export class ' + modelname + ' ' + jsonString
    const filename = modelname + '.' + extension
    const exportPath = path.resolve(path.join(defaults.basePath, defaults.exportFolder))
    fs.mkdirSync(exportPath, { recursive: true })
    fs.writeFileSync(path.join(exportPath, filename), jsonString, 'utf8')
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

module.exports = {
    exportModel: exportModel
}