const fs = require('fs')
const path = require('path')
const { unlink } = require('node:fs/promises');
const { INVALID_MODEL_ERROR } = require('../../lib/constants/messages.constants')
const { ModelService, SequelizeService } = require('../../lib/services/index')

const outputFolderPath = path.join(__dirname, '..', '..', 'output-models');

describe('Test all methods from Model Service', () => {
    const argv = {
        path: path.join(__dirname, '..', '..', 'example', 'sequelize-app', 'src', 'models', 'index.js')
    }
    const dbPath = SequelizeService.getSequelizePath(argv)
    test('Should throw an error if the model is not provided', () => {
        expect(() => ModelService.exportModel(null, dbPath))
            .toThrow(INVALID_MODEL_ERROR)
        expect(() => ModelService.exportModel({ model: '' }, dbPath))
            .toThrow(INVALID_MODEL_ERROR)
        expect(() => ModelService.exportModel({ m: '' }, dbPath))
            .toThrow(INVALID_MODEL_ERROR)
    })
    test('Should create the .ts class for the provided model', () => {
        ModelService.exportModel({ model: 'Province' }, dbPath)
        expect(fs.existsSync(path.join(outputFolderPath, 'Province.ts'))).toBe(true)
    })
    test('Should create the .py class for the provided model', () => {
        ModelService.exportModel({ model: 'Province', extension: 'py' }, dbPath)
        expect(fs.existsSync(path.join(outputFolderPath, 'Province.py'))).toBe(true)
    })
    test('Should create the .js class for the provided model', () => {
        ModelService.exportModel({ model: 'Province', extension: 'js' }, dbPath)
        expect(fs.existsSync(path.join(outputFolderPath, 'Province.js'))).toBe(true)
    })
    test('Should create the .cs class for the provided model', () => {
        ModelService.exportModel({ model: 'Province', extension: 'cs' }, dbPath)
        expect(fs.existsSync(path.join(outputFolderPath, 'Province.cs'))).toBe(true)
    })
    test('Should create the .php class for the provided model', () => {
        ModelService.exportModel({ model: 'Province', extension: 'php' }, dbPath)
        expect(fs.existsSync(path.join(outputFolderPath, 'Province.php'))).toBe(true)
    })
    test('Should create a java class for the provided model', async () => {
        ModelService.exportModel({ model: 'Province', extension: 'java' }, dbPath)
        expect(fs.existsSync(path.join(outputFolderPath, 'Province.java'))).toBe(true)
    })
})

//Removing all test model's files created
afterAll(() => {
    (async () => {
        const extensions = ['.ts', '.js', '.java', '.py', '.cs', '.php']
        for (const extension of extensions) {
            await unlink(path.join(outputFolderPath, `Province${extension}`))
        }
    })()
})
