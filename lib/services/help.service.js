const cliUsage = require('command-line-usage');

function showUsageGuide() {
    const sections = [
        {
            header: 'model-to-file CLI Script',
            content: "Exports {bold Sequelize} JavaScript models to different high level programming language' class files.",
        },
        {
            header: 'Synopsis',
            content: [
                '$ model-to-file {bold --model} ModelName [{bold -p}] {underline ./path/to/models/index.js} [{bold -e}] py',
                '$ model-to-file {bold --help}'
            ]
        },
        {
            header: 'Mandatory Options',
            optionList: [
                {
                    name: 'model',
                    alias: 'm',
                    type: String,
                    typeLabel: '{underline ModelName}',
                    description: 'The name of the model you want to export.',
                },
            ],
        },
        {
            header: 'Optional Arguments',
            optionList: [
                {
                    name: 'extension',
                    alias: 'e',
                    type: String,
                    typeLabel: '{underline ts}',
                    defaultOption: 'ts',
                    description: 'File/language extension for the output class file. Supports {italic ts}, {italic js}, {italic py}, {italic php} and {italic cs}.',
                },
                {
                    name: 'path',
                    alias: 'p',
                    type: String,
                    typeLabel: '{underline ./models/index.js}',
                    defaultOption: './models/index.js',
                    description: 'Path to the {bold Sequelize} index.js file.',
                },
                {
                    name: 'help',
                    alias: 'h',
                    type: Boolean,
                    description: 'Print this usage guide.',
                }
            ],
        },
    ];

    const usage = cliUsage(sections);
    console.info(usage);
}

module.exports = {
    showUsageGuide
}