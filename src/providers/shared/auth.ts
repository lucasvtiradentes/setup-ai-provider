import { cleanupPiConsumer, setupPiConsumer } from '../../consumers/pi'
import type { ActionInputs } from '../../inputs/inputs'
import { getProvider, getProviders } from './registry'
import { ConsumerName } from './types'

export async function setupProviderAuth(inputs: ActionInputs): Promise<void> {
	await getProvider(inputs.provider).setupAuth(inputs)
	await setupAdditionalConsumers(inputs)
}

export async function cleanupProviderAuth(): Promise<void> {
	await cleanupAdditionalConsumers()
	for (const provider of getProviders()) {
		await provider.cleanupAuth()
	}
}

async function setupAdditionalConsumers(inputs: ActionInputs): Promise<void> {
	for (const consumer of inputs.additionalConsumers) {
		if (consumer === ConsumerName.Pi) {
			await setupPiConsumer(inputs)
		}
	}
}

async function cleanupAdditionalConsumers(): Promise<void> {
	await cleanupPiConsumer()
}
