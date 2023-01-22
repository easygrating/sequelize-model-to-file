const path = require('path');
const fs = require('fs');
const { INVALID_MODEL_ERROR } = require('../constants/messages.constants');
const { buildTypeScript } = require('./types/typescript.service');
const { buildJavaScript } = require('./types/javascript.service');
const { buildPython } = require('./types/python.service');
const defaults = {
    basePath: path.resolve('./'),
    exportFolder: '/output-models'
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
    let jsonString;
    switch (extension) {
        case 'js':
            jsonString = buildJavaScript(model, modelname)
            break;
        case 'py':
            jsonString = buildPython(model, modelname)
            break;
        default:
            jsonString = buildTypeScript(model, modelname)
            break;
    }
    const filename = modelname + '.' + extension
    const exportPath = path.resolve(path.join(defaults.basePath, defaults.exportFolder))
    fs.mkdirSync(exportPath, { recursive: true })
    fs.writeFileSync(path.join(exportPath, filename), jsonString, 'utf8')
}

module.exports = { exportModel: exportModel }