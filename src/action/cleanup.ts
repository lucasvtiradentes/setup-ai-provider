import * as core from '@actions/core'
import { cleanupProviderAuth } from '../providers/shared/auth'

export async function runCleanup(): Promise<void> {
	try {
		await cleanupProviderAuth()
	} catch (error) {
		core.warning(error instanceof Error ? error.message : String(error))
	}
}
