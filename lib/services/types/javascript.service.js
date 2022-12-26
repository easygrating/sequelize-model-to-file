const { keys } = require('lodash')

/**
 * Create an string of a JavaScript class
 * @param {*} model the sequelize model
 * @param {*} modelname the name of the model 
 * @returns the class to write in the file
 */
function buildJavaScript(model, modelname) {
    const fields = keys(model.rawAttributes)
    const associations = keys(model.associations)
    return getJSClass(modelname, fields, associations)
}

/**
* Builds the JavaScript class
* @param {*} modelname the name of the model to be use as the class name
* @param {*} fields the field names of the model
* @param {*} associations the relations of the model
* @returns the class in string format
*/
function getJSClass(modelname, fields, associations) {
    let constructor = 'constructor(' + fields.join() + ') {' + '\n'
    fields.forEach(field => constructor += 'this.' + field + ' = ' + field + ';\n');
    associations.forEach(association => constructor += 'this.' + association + ' = ' + association + ';\n')
    return 'class ' + modelname + '{' + '\n' + constructor + '}\n}'
}

module.exports = { buildJavaScript: buildJavaScript }