const { mapValues } = require('lodash')
const { snakeize } = require('casing')

/**
 * Create a string of a Python class
 * @param {*} model the sequelize model
 * @param {*} modelname the name of the model 
 * @returns the class to write in the file
 */
function buildPython(model, modelname) {
    let useSequenceImport = false;
    let useDatetimeImport = false;
    let fields = mapValues(model.rawAttributes, item => {
        const itemType = item.type.constructor.name
        if (['DATE', 'DATEONLY'].includes(itemType)) 
            useDatetimeImport = true;
        return getPyDataType(itemType)
    })
    let associations = mapValues(model.associations, item => {
        if (item.isMultiAssociation) {
            useSequenceImport = true;
            return `Sequence[${item.target.name}]`
        }
        return item.as
    })
    return getPyClass(modelname, fields, associations, { useDatetimeImport, useSequenceImport})
}

/**
* Builds the Python class to write in the file
* @param {*} modelname the name of the model to be use as the class name
* @param {*} schema the field names and types
* @param {*} associations the relations of the model
* @returns the class in string format
*/
function getPyClass(modelname, schema, associations, imports) {
    let classString = '# This class was exported via node package model-to-file.\n'
    if (imports.useSequenceImport) classString += 'from typing import Sequence\n'
    if (imports.useDatetimeImport) classString += `from datetime import datetime\n`
    classString += '\n'
    classString += `class ${modelname}:\n`
    classString += '\n'
    let constructorArgs = []
    for (const [key, value] of Object.entries(snakeize(schema))) {
        const arg = `${key}: ${value}`
        classString += `\t${arg}\n`
        constructorArgs.push(arg)
    }
    for (const [key, value] of Object.entries(snakeize(associations))) {
        const arg = `${key}: ${value}`
        classString += `\t${arg}\n`
        constructorArgs.push(arg)
    }
    classString += '\n'
    classString += `\tdef __init__(self, ${constructorArgs.join(', ')}):\n`
    for (const key in snakeize(schema)) {
        classString += `\t\tself.${key} = ${key}\n`
    }
    for (const key in snakeize(associations)) {
        classString += `\t\tself.${key} = ${key}\n`
    }
    return classString
}

/**
 * Returns the equivalent data types from Sequelize types to Python types
 * @param {*} type sequelize field's type 
 * @returns the equivalent Python type
 */
function getPyDataType(type) {
    switch (type) {
        case 'INTEGER':
            return 'int';
        case 'DECIMAL':
        case 'DOUBLE':
        case 'FLOAT':
            return 'float'
        case 'DATE':
        case 'DATEONLY':
            return 'datetime'
        case 'BOOLEAN':
            return 'bool'
        case 'STRING':
        case 'TEXT':
            return 'str'
    }
}

module.exports = { buildPython: buildPython }
