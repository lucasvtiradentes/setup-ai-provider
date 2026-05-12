import * as core from '@actions/core'
import { ZodError } from 'zod'
import { readInputs } from './inputs'
import { setupProviderAuth } from './providers/shared/auth'
import { getProvider } from './providers/shared/registry'
import { collectAndUploadSessions } from './sessions/collect'

void run()

async function run(): Promise<void> {
	try {
		const inputs = readInputs()
		const provider = getProvider(inputs.provider)

		core.setOutput('provider', inputs.provider)
		core.setOutput('command', provider.command)

		if (inputs.installCli) {
			await provider.install(inputs)
		}
		await setupProviderAuth(inputs)

		const sessions = await collectAndUploadSessions(inputs, provider)
		core.setOutput('session-files-path', sessions.path)
		core.setOutput('session-files-found', String(sessions.found))
		core.setOutput('artifact-id', sessions.artifactId)
		core.setOutput('artifact-url', sessions.artifactUrl)
	} catch (error) {
		handleError(error)
	}
}

function handleError(error: unknown): void {
	if (error instanceof ZodError) {
		core.setFailed(error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n'))
		return
	}

	core.setFailed(error instanceof Error ? error.message : String(error))
}
