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
			exportEnv: true,
			installCli: true,
			provider: 'claude',
			retentionDays: 7,
			sessionFilesPath: 'provider-session-files',
			uploadSessionFiles: false,
		})
	})

	it('rejects invalid providers', () => {
		process.env.INPUT_PROVIDER = 'openrouter'

		expect(() => readInputs()).toThrow()
	})
})
