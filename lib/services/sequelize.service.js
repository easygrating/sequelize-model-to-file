const path = require('path');
const fs = require('fs');
const defaults = {
    basePath: path.resolve('./'),
    baseSequelize: '/models/index.js',
    baseSequelizeAlt: '/src/models/index.js',
    exportFolder: '/sequelizeModels',
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
            throw new Error('Error reading sequelize path.')
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

module.exports = { getSequelizePath: getSequelizePath }