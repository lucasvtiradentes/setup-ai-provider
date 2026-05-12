import * as core from '@actions/core'
import { cleanupProviderAuth } from './providers/shared/auth'

void runCleanup()

async function runCleanup(): Promise<void> {
	try {
		await cleanupProviderAuth()
	} catch (error) {
		core.warning(error instanceof Error ? error.message : String(error))
	}
}
