const fs = require('fs')
const path = require('path')

/**
 * Recursively returns all files in a directory
 * @param dir {string || Buffer || URL}
 * @param files {string[] || null}
 * */
function getFiles (dir, files = null) {
	files = files || []
	const currentFiles = fs.readdirSync(dir)
	for (const i in currentFiles) {
		const name = path.join(dir, currentFiles[i])
		if (fs.statSync(name).isDirectory()) {
			getFiles(name, files)
		} else
			files.push(name)
	}
	return files
}

module.exports = {
	getFiles: getFiles
}
