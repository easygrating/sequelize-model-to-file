const { template, uniq, camelCase, forEach, upperFirst } = require("lodash");
const { readFileSync } = require("fs");
const { resolve } = require("path");

/**
 * Create an string of a Java class
 * @param {*} model the sequelize model
 * @param {*} modelname the name of the model 
 * @returns the class to write in the file
 */
function buildJava(model, modelName) {
    const templateFile = readFileSync(resolve(__dirname, "../../templates/java.template"));
    const { properties, imports } = processAttributes(model);
    const props = { className: modelName, properties, packages: uniq(imports) };
    const compile = template(templateFile);
    return compile(props).replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

/**
 * Process model attributes and generates a template properties
 * @param {*} model the sequelize model
 * @returns the template properties of the given model
 */
function processAttributes(model) {
    const properties = [];
    const imports = [];
    forEach(model.rawAttributes, (value, key) => {
        const processed = processType(value.type.constructor.name);
        if (!processed) return;
        properties.push(
            {
                type: processed.type,
                name: camelCase(key),
                defaultValue: processed.defaultValue,
                methodName: upperFirst(camelCase(key))
            });
        if (!!processed.imports.length) {
            imports.push(...processed.imports);
        }
    });

    forEach(model.associations, (item) => {
        if (item.isMultiAssociation) {
            properties.push(
                {
                    type: `LinkedList<${item.target.name}>`,
                    name: camelCase(item.as),
                    defaultValue: "new LinkedList<>()",
                    methodName: upperFirst(camelCase(item.as))
                });
            imports.push("java.util.LinkedList;")
        } else {
            properties.push({ type: item.as, name: item.as });
        }
    });

    return { properties, imports };
}

/**
* Util method to return the equivalent data types from Sequelize types to Java types and imports
* @param {*} type sequelize field's type
* @returns an object with the Java type and optional imports statements
*/
function processType(type) {
    const result = { type: undefined, imports: [], defaultValue: undefined };
    switch (type) {
        case "INTEGER":
            result.type = "int";
            result.defaultValue = 0;
            break;
        case "DECIMAL":
        case "DOUBLE":
            result.type = "double";
            result.defaultValue = 0.0;
            break;
        case "FLOAT":
            result.type = "float";
            result.defaultValue = 0.0;
            break;
        case "BOOLEAN":
            result.type = "boolean";
            result.defaultValue = false;
            break;
        case "STRING":
        case "TEXT":
            result.type = "String";
            result.defaultValue = "";
            break;
        case "DATE":
        case "DATEONLY":
            result.type = "Date";
            result.imports.push("java.util.Date;");
            result.defaultValue = "new Date()";
            break;
    }
    return result.type ? result : null;
}

module.exports = { buildJava: buildJava }