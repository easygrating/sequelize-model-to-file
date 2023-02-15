const { readFileSync } = require("fs");
const { forEach, template, uniq, upperFirst, camelCase } = require("lodash");
const { resolve } = require("path");

/**
 * Create an string of a C-Sharp class
 * @param {*} model the sequelize model
 * @param {*} modelname the name of the model
 * @returns the class to write in the file
 */
function buildCs(model, modelname) {
  const templateFile = readFileSync(
    resolve(__dirname, "../../templates/c-sharp.template")
  );

  const { properties, usings } = processAttributes(model);
  const props = { className: modelname, properties, usings: uniq(usings) };

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
  const usings = [];
  forEach(model.rawAttributes, (value, key) => {
    const processed = processType(value.type.constructor.name);
    if (!processed) return;
    properties.push({ type: processed.type, name: upperFirst(camelCase(key)) });
    if (!!processed.usings.length) {
      usings.push(...processed.usings);
    }
  });

  forEach(model.associations, (item) => {
    if (item.isMultiAssociation) {
      properties.push({ type: `List<${item.target.name}>`, name: item.as });
    } else {
      properties.push({ type: item.as, name: item.as });
    }
  });

  if (
    Object.values(model.associations).some((item) => item.isMultiAssociation)
  ) {
    usings.push("System.Collections.Generic;");
  }
  return { properties, usings };
}

/**
 * Util method to return the equivalent data types from Sequelize types to C-Sharp types and usings
 * @param {*} type sequelize field's type
 * @returns an object with the c-sharp type and optional using statements
 */
function processType(type) {
  const result = { type: undefined, usings: [] };
  switch (type) {
    case "INTEGER":
      result.type = "int";
      break;
    case "DECIMAL":
    case "DOUBLE":
    case "FLOAT":
    case "STRING":
      result.type = type.toLowerCase();
      break;
    case "DATE":
    case "DATEONLY":
      result.type = "DateTime";
      result.usings.push("System;");
      break;
    case "BOOLEAN":
      result.type = "Date";
      break;
    case "TEXT":
      result.type = "string";
      break;
  }
  return result.type ? result : null;
}

module.exports = { buildCs: buildCs };
