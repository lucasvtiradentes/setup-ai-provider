import * as core from '@actions/core'
import { ZodError } from 'zod'
import { OutputName } from './inputs/configs'
import { readInputs } from './inputs/inputs'
import { saveSessionInputs } from './inputs/state'
import { setupProviderAuth } from './providers/shared/auth'
import { getProvider } from './providers/shared/registry'

void run()

async function run(): Promise<void> {
	try {
		const inputs = readInputs()
		const provider = getProvider(inputs.provider)

		core.setOutput(OutputName.Provider, inputs.provider)
		core.setOutput(OutputName.Command, provider.command)

		await provider.install(inputs)
		await setupProviderAuth(inputs)
		saveSessionInputs(inputs)
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
