import type { ActionInputs } from '../action/inputs'

export type ProviderName = 'claude' | 'codex' | 'gemini'

export type AiProvider = {
	readonly command: string
	readonly name: ProviderName
	readonly sessionDir: string
	cleanupAuth(): Promise<void>
	install(inputs: ActionInputs): Promise<void>
	setupAuth(inputs: ActionInputs): Promise<void>
}
