const { forOwn } = require('lodash')

/**
 * Create an string of a Java class
 * @param {*} model the sequelize model
 * @param {*} modelname the name of the model 
 * @returns the class to write in the file
 */
function buildJava(model, modelname) {
    let fields = []
    forOwn(model.rawAttributes, (value, key) => {
        fields.push(`\tprivate ${getJavaDataType(value.type.constructor.name)} ${key};`)
    })
    let associations = []
    forOwn(model.associations, (value, key) => {
        if (value.isMultiAssociation)
            associations.push(`\tList<${key}> ${key.toLowerCase()} = new LinkedList();`)
        associations.push(`\tprivate ${key} ${key.toLowerCase()};`)
    })
    return getJavaClass(modelname, fields, associations)
}

/**
* Builds the Java class to write in the file
* @param {*} modelname the name of the model to be use as the class name
* @param {*} fields the field names and types
* @param {*} associations the relations of the model
* @returns the class in string format
*/
function getJavaClass(modelname, fields, associations) {
    let body = ' {\n'
    fields.forEach(field => body += field + '\n');
    associations.forEach(association => body += association + '\n');
    body += '}'
    let javaClass = `import java.util.*;\npublic class ${modelname} ${body}`
    return javaClass
}

/**
 * Util method to return the equivalent data types from Sequelize types to Java types
 * @param {*} type sequelize field's type 
 * @returns the equivalent Java type
 */
function getJavaDataType(type) {
    switch (type) {
        case 'INTEGER':
            return 'int'
        case 'DECIMAL':
        case 'DOUBLE':
            return 'double'
        case 'FLOAT':
            return 'float'
        case 'DATE':
        case 'DATEONLY':
            return 'java.util.Date'
        case 'BOOLEAN':
            return 'boolean'
        case 'STRING':
        case 'TEXT':
            return 'String'
    }
}

module.exports = { buildJava: buildJava }