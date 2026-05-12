import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { DefaultArtifactClient } from '@actions/artifact'
import * as core from '@actions/core'
import type { ActionInputs } from '../inputs'
import type { AiProvider } from '../providers/shared/types'

type SessionResult = {
	artifactId: string
	artifactUrl: string
	found: boolean
	path: string
}

export async function collectAndUploadSessions(inputs: ActionInputs, provider: AiProvider): Promise<SessionResult> {
	const destination = resolve(inputs.sessionFilesPath)
	let found = false

	if (inputs.collectSessionFiles || inputs.uploadSessionFiles) {
		found = await collectSessions(provider, destination)
	}

	let artifactId = ''
	let artifactUrl = ''

	if (inputs.uploadSessionFiles) {
		if (found) {
			const artifact = new DefaultArtifactClient()
			const upload = await artifact.uploadArtifact(getArtifactName(inputs), await listFiles(destination), destination, {
				retentionDays: inputs.retentionDays,
			})
			artifactId = String(upload.id ?? '')
			artifactUrl = buildArtifactUrl(artifactId)
		} else {
			core.warning(`No ${inputs.provider} session files found to upload`)
		}
	}

	return { artifactId, artifactUrl, found, path: destination }
}

async function collectSessions(provider: AiProvider, destination: string): Promise<boolean> {
	const source = join(homedir(), provider.sessionDir)
	await rm(destination, { force: true, recursive: true })
	await mkdir(destination, { recursive: true })

	if (!(await exists(source))) {
		return false
	}

	await cp(source, destination, { recursive: true })
	return hasFiles(destination)
}

async function exists(path: string): Promise<boolean> {
	try {
		await stat(path)
		return true
	} catch {
		return false
	}
}

async function hasFiles(path: string): Promise<boolean> {
	const files = await listFiles(path)
	return files.length > 0
}

async function listFiles(path: string): Promise<string[]> {
	const entries = await readdir(path, { recursive: true, withFileTypes: true })
	return entries.filter((entry) => entry.isFile()).map((entry) => join(entry.parentPath, entry.name))
}

function getArtifactName(inputs: ActionInputs): string {
	return inputs.artifactName || `${inputs.provider}-session-files`
}

function buildArtifactUrl(artifactId: string): string {
	const serverUrl = process.env.GITHUB_SERVER_URL
	const repository = process.env.GITHUB_REPOSITORY
	const runId = process.env.GITHUB_RUN_ID

	if (!artifactId || !serverUrl || !repository || !runId) {
		return ''
	}

	return `${serverUrl}/${repository}/actions/runs/${runId}/artifacts/${artifactId}`
}
