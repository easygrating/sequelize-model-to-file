const path = require("path");
const fs = require("fs");
const { INVALID_PATH_ERROR } = require("../constants/messages.constants");
const defaults = {
  basePath: path.resolve("./"),
  baseSequelize: "/models/index.js",
  baseSequelizeAlt: "/src/models/index.js",
  sequelizerc: path.resolve("./.sequelizerc"),
  exportFolder: "/sequelizeModels",
};
/**
 * Util method to locate and read `index.js` to load the sequelize model to export
 * @param {*} argv the argv from the command line, and object with the `path` field containing the path to sequelize models folder
 * @returns the sequelize path to the models folder
 */
function getSequelizePath(argv) {
  let sequelizePath = argv?.path;

  if (!sequelizePath) {
    // load .sequelizerc
    const sequelizerc = loadSequelizerc();
    sequelizePath = sequelizerc?.["models-path"];
  }

  if (!sequelizePath) {
    //Assign default path value to `sequelizePath` variable
    sequelizePath = path.resolve(
      path.join(defaults.basePath, defaults.baseSequelize)
    );
  }

  //Read path
  try {
    sequelizePath = path.resolve(sequelizePath);
    fs.statSync(sequelizePath);
  } catch (e) {
    throw new Error(INVALID_PATH_ERROR);
  }

  return sequelizePath;
}

function loadSequelizerc() {
  try {
    fs.statSync(defaults.sequelizerc);
    return require(defaults.sequelizerc);
  } catch (e) {
    return null;
  }
}

module.exports = { getSequelizePath: getSequelizePath };
