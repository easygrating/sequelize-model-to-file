const { mapValues } = require('lodash')
const path = require('path');
const fs = require('fs');

function exportModel(argv, sequelizePath) {
    const db = require(sequelizePath)
    const modelname = argv.model || argv.m
    let extension = argv.extension || argv.e || 'js'
    const exp = argv.export

    extension = extension.replace(/\./, '')
    if (!modelname || !db.hasOwnProperty(modelname))
        throw new Error('Invalid model')
    const model = db[modelname]
    let schema = mapValues(model.rawAttributes, item => {
        return getDataType(item.type.constructor.name)
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
    jsonString = (exp ? 'export' : '') + ' class ' + modelname + ' ' + jsonString
    const filename = modelname + '.' + extension
    const exportPath = path.resolve(path.join(defaults.basePath, defaults.exportFolder))
    fs.mkdirSync(exportPath, { recursive: true })
    fs.writeFileSync(path.join(exportPath, filename), jsonString, 'utf8')
}

function getDataType(type) {
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