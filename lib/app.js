const { ModelService, SequelizeService } = require('./services')
const { alias } = require('./constants/utils.constants')

module.exports = function () {
    const argv = require('minimist')(process.argv.slice(2), { alias })
    try {
        let sequelizePath = SequelizeService.getSequelizePath(argv)
        ModelService.exportModel(argv, sequelizePath)
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
}
