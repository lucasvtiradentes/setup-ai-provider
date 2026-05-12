import * as core from '@actions/core'
import { ZodError } from 'zod'
import { readSessionInputs } from './inputs'
import { cleanupProviderAuth } from './providers/shared/auth'
import { getProvider } from './providers/shared/registry'
import { collectAndUploadSessions } from './sessions/collect'

void runCleanup()

async function runCleanup(): Promise<void> {
	try {
		const inputs = readSessionInputs()

		if (inputs) {
			await collectAndUploadSessions(inputs, getProvider(inputs.provider))
		}
	} catch (error) {
		handleSessionError(error)
	}

	try {
		await cleanupProviderAuth()
	} catch (error) {
		handleCleanupError(error)
	}
}

function handleSessionError(error: unknown): void {
	if (error instanceof ZodError) {
		core.setFailed(error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n'))
		return
	}

	core.setFailed(error instanceof Error ? error.message : String(error))
}

function handleCleanupError(error: unknown): void {
	core.warning(error instanceof Error ? error.message : String(error))
}
