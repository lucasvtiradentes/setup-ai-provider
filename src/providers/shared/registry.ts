import { ClaudeProvider } from '../claude'
import { CodexProvider } from '../codex'
import { GeminiProvider } from '../gemini'
import { type AiProvider, ProviderName } from './types'

const providers = {
	[ProviderName.Claude]: new ClaudeProvider(),
	[ProviderName.Codex]: new CodexProvider(),
	[ProviderName.Gemini]: new GeminiProvider(),
} satisfies Record<ProviderName, AiProvider>

export function getProvider(name: ProviderName): AiProvider {
	return providers[name]
}

export function getProviders(): AiProvider[] {
	return Object.values(providers)
}
