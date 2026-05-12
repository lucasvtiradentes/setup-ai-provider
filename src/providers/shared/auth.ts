import type { ActionInputs } from '../../action/inputs'
import { getProvider, getProviders } from './registry'

export async function setupProviderAuth(inputs: ActionInputs): Promise<void> {
	await getProvider(inputs.provider).setupAuth(inputs)
}

export async function cleanupProviderAuth(): Promise<void> {
	for (const provider of getProviders()) {
		await provider.cleanupAuth()
	}
}
