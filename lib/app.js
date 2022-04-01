const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const defaults = {
    basePath: path.resolve('./'),
    baseSequelize: '/models/index.js',
    baseSequelizeAlt: '/src/models/index.js',
    exportFolder: '/sequelizeModels',
}
const alias = {
    'model': 'm',
    'extension': 'e',
    'path': ['p', 'sequelize-path'],
    'export': ['export-class']
}
const boolean = ['export']

module.exports = function () {
    const argv = require('minimist')(process.argv.slice(2), { alias, boolean })
    try {
        let sequelizePath = getSequelizePath(argv)
        exportModel(argv, sequelizePath)
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }

}
function getSequelizePath(argv) {
    let sequelizePath = argv.path

    if (!sequelizePath)
        sequelizePath = path.resolve(path.join(defaults.basePath, defaults.baseSequelize))
    else
        try {
            sequelizePath = path.resolve(sequelizePath)
            fs.statSync(sequelizePath)
        } catch (e) {

        }

    let hasError = false
    try {
        fs.statSync(sequelizePath)
    } catch (e) {
        hasError = true
    }

    if (hasError) {
        hasError = false
        sequelizePath = path.resolve(path.join(defaults.basePath, defaults.baseSequelizeAlt))
        try {
            fs.statSync(sequelizePath)
        } catch (e) {
            throw new Error('Invalid sequelize path or default sequelize folder does not exist. Please provide a valid sequelize path with -p option')
        }
    }

    return sequelizePath

}


function exportModel(argv, sequelizePath) {
    const db = require(sequelizePath)
    const modelname = argv.model || argv.m
    let extension = argv.extension || argv.e || 'js'
    const exp = argv.export

    extension = extension.replace(/\./, '')
    if (!modelname || !db.hasOwnProperty(modelname))
        throw new Error('Invalid model')
    const model = db[modelname]
    let schema = _.mapValues(model.rawAttributes, item => {
        return getDataType(item.type.constructor.name)
    })

    let associations = _.mapValues(model.associations, item => {
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