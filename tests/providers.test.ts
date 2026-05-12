import { describe, expect, it } from 'vitest'
import { getProviders } from '../src/providers/shared/registry'

describe('providers', () => {
	it('defines the supported provider commands and session directories', () => {
		expect(
			getProviders().map((provider) => ({
				command: provider.command,
				name: provider.name,
				sessionDir: provider.sessionDir,
			})),
		).toEqual([
			{
				command: 'claude',
				name: 'claude',
				sessionDir: '.claude/projects',
			},
			{
				command: 'codex',
				name: 'codex',
				sessionDir: '.codex/sessions',
			},
			{
				command: 'gemini',
				name: 'gemini',
				sessionDir: '.gemini/tmp',
			},
		])
	})
})
