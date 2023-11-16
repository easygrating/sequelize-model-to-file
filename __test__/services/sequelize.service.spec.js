const { INVALID_PATH_ERROR } = require('../../lib/constants/messages.constants')
const { SequelizeService } = require('../../lib/services/index')
const { join } = require('path')

describe('Test all methods from Sequelize Service', () => {
    test('Should throw an error', async () => {
        expect(() => SequelizeService.getSequelizePath()).toThrow(INVALID_PATH_ERROR)
    })
    test('Should return the sequelize path from default lib folder', async () => {
        const argv = {
            path: join(__dirname, '..', '..', 'example', 'sequelize-app', 'src', 'models', 'index.js')
        }
        const dbPath = SequelizeService.getSequelizePath(argv)
        expect(dbPath.includes('index.js')).toBe(true)
    })
})