const { execSync } = require('node:child_process')
const { readFileSync, writeFileSync } = require('node:fs')
const { join } = require('node:path')

function log(message) {
	console.log(`[changeset-commit] ${message}`)
}

function updateReadmeVersion() {
	const packageJsonPath = join(process.cwd(), 'package.json')
	const readmePath = join(process.cwd(), 'README.md')

	try {
		const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
		const newVersionTag = `setup-ai-provider@v${packageJson.version}`
		const versionPattern = /setup-ai-provider@v\d+\.\d+\.\d+/g
		const readme = readFileSync(readmePath, 'utf8')
		const matches = readme.match(versionPattern)

		if (!matches) {
			log('No README action version references found')
			return
		}

		writeFileSync(readmePath, readme.replace(versionPattern, newVersionTag), 'utf8')
		execSync('git add README.md', { stdio: 'inherit' })
		log(`Updated ${matches.length} README action version reference(s) to ${newVersionTag}`)
	} catch (error) {
		log(`Error updating README action version references: ${error.message}`)
	}
}

function getVersionMessage() {
	log('Running getVersionMessage hook')
	updateReadmeVersion()

	return 'Version Packages'
}

module.exports = {
	getVersionMessage,
}
