const { SequelizeService } = require('../../lib/services/index')

describe('Test all methods from Sequelize Service', () => {
    test('Should return the sequelize path from default lib folder', async () => {
        const dbPath = SequelizeService.getSequelizePath()
        expect(dbPath.includes('index.js')).toBe(true)
    })
})