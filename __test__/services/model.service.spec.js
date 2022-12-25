const { INVALID_MODEL_ERROR } = require('../../lib/constants/messages.constants')
const { ModelService, SequelizeService } = require('../../lib/services/index')
const fs = require('fs')
const path = require('path')

describe('Test all methods from Model Service', () => {
    const dbPath = SequelizeService.getSequelizePath()
    test('Should throw an error if the model is not provided', async () => {
        expect(() => ModelService.exportModel(null, dbPath))
            .toThrow(INVALID_MODEL_ERROR)
        expect(() => ModelService.exportModel({ model: '' }, dbPath))
            .toThrow(INVALID_MODEL_ERROR)
        expect(() => ModelService.exportModel({ m: '' }, dbPath))
            .toThrow(INVALID_MODEL_ERROR)
    })
    test('Should create the .ts class for the provided model', async () => {
        ModelService.exportModel({ model: 'Province' }, dbPath)
        expect(fs.existsSync(path.join(__dirname, '..', '..', 'sequelizeModels', 'Province.ts')))
            .toBe(true)
    })
})

afterAll(() => {
    fs.unlinkSync(path.join(__dirname, '..', '..', 'sequelizeModels', 'Province.ts'))
})