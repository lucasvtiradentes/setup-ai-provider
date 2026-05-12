import { afterEach, describe, expect, it } from 'vitest'
import { readInputs } from '../src/inputs/inputs'
import { readSessionInputs } from '../src/inputs/state'

const originalEnv = { ...process.env }

afterEach(() => {
	process.env = { ...originalEnv }
})

describe('readInputs', () => {
	it('reads defaults', () => {
		process.env.INPUT_PROVIDER = 'claude'

		expect(readInputs()).toMatchObject({
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

	it('reads saved session inputs', () => {
		process.env.STATE_provider = 'codex'
		process.env['STATE_artifact-name'] = 'codex-session'
		process.env['STATE_retention-days'] = '3'
		process.env['STATE_session-files-path'] = 'sessions'
		process.env['STATE_upload-session-files'] = 'true'

		expect(readSessionInputs()).toEqual({
			artifactName: 'codex-session',
			provider: 'codex',
			retentionDays: 3,
			sessionFilesPath: 'sessions',
			uploadSessionFiles: true,
		})
	})

	it('skips session inputs when setup state is missing', () => {
		expect(readSessionInputs()).toBeNull()
	})

	it('rejects invalid providers', () => {
		process.env.INPUT_PROVIDER = 'openrouter'

		expect(() => readInputs()).toThrow()
	})
})
