import { afterEach, describe, expect, it } from 'vitest'
import { readInputs } from '../src/inputs'

const originalEnv = { ...process.env }

afterEach(() => {
	process.env = { ...originalEnv }
})

describe('readInputs', () => {
	it('reads defaults', () => {
		process.env.INPUT_PROVIDER = 'claude'

		expect(readInputs()).toMatchObject({
			collectSessionFiles: false,
			provider: 'claude',
			retentionDays: 7,
			sessionFilesPath: 'provider-session-files',
			uploadSessionFiles: false,
		})
	})

	it('reads provider auth json inputs', () => {
		process.env.INPUT_PROVIDER = 'gemini'
		process.env['INPUT_CODEX-AUTH-JSON'] = '{"codex":true}'
		process.env['INPUT_GEMINI-AUTH-JSON'] = '{"gemini":true}'

		expect(readInputs()).toMatchObject({
			codexAuthJson: '{"codex":true}',
			geminiAuthJson: '{"gemini":true}',
		})
	})

	it('rejects invalid providers', () => {
		process.env.INPUT_PROVIDER = 'openrouter'

		expect(() => readInputs()).toThrow()
	})
})
