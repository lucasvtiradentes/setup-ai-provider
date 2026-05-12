import type { ActionInputs } from '../../inputs'

export enum ProviderName {
	Claude = 'claude',
	Codex = 'codex',
	Gemini = 'gemini',
}

export type AiProvider = {
	readonly command: string
	readonly name: ProviderName
	readonly sessionDir: string
	cleanupAuth(): Promise<void>
	install(inputs: ActionInputs): Promise<void>
	setupAuth(inputs: ActionInputs): Promise<void>
}
