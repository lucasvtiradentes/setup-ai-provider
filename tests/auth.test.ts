import { mkdir, mkdtemp, readFile, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import type { ActionInputs } from '../src/inputs/inputs'
import { setupProviderAuth } from '../src/providers/shared/auth'
import { ConsumerName, ProviderName } from '../src/providers/shared/types'

const baseInputs: ActionInputs = {
	additionalConsumers: [],
	artifactName: '',
	claudeCodeOauthToken: '',
	codexAuthJson: '',
	geminiAuthJson: '',
	provider: ProviderName.Claude,
	retentionDays: 7,
	sessionFilesPath: 'provider-session-files',
	uploadSessionFiles: false,
}

const originalHome = process.env.HOME
const originalGeminiTrustWorkspace = process.env.GEMINI_CLI_TRUST_WORKSPACE

afterEach(() => {
	process.env.HOME = originalHome
	process.env.GEMINI_CLI_TRUST_WORKSPACE = originalGeminiTrustWorkspace
})

describe('setupProviderAuth', () => {
	it('writes codex auth with private file permissions', async () => {
		const home = await mkdtemp(join(tmpdir(), 'setup-ai-provider-'))
		process.env.HOME = home

		await setupProviderAuth({
			...baseInputs,
			codexAuthJson: '{"access_token":"secret"}',
			provider: ProviderName.Codex,
		})

		const authPath = join(home, '.codex', 'auth.json')
		expect(await readFile(authPath, 'utf8')).toBe('{"access_token":"secret"}')
		expect((await stat(authPath)).mode & 0o777).toBe(0o600)
	})

	it('writes pi codex auth as an additional consumer', async () => {
		const home = await mkdtemp(join(tmpdir(), 'setup-ai-provider-'))
		process.env.HOME = home

		await setupProviderAuth({
			...baseInputs,
			additionalConsumers: [ConsumerName.Pi],
			codexAuthJson: JSON.stringify({
				tokens: {
					access_token: makeJwt(123),
					account_id: 'account-id',
					refresh_token: 'refresh-secret',
				},
			}),
			provider: ProviderName.Codex,
		})

		const piAuthPath = join(home, '.pi', 'agent', 'auth.json')
		const piAuth = JSON.parse(await readFile(piAuthPath, 'utf8'))

		expect(piAuth['openai-codex']).toEqual({
			access: makeJwt(123),
			accountId: 'account-id',
			expires: 123000,
			refresh: 'refresh-secret',
			type: 'oauth',
		})
		expect((await stat(piAuthPath)).mode & 0o777).toBe(0o600)
	})

	it('writes gemini credentials and preserves existing settings', async () => {
		const home = await mkdtemp(join(tmpdir(), 'setup-ai-provider-'))
		process.env.HOME = home
		const geminiDir = join(home, '.gemini')
		const settingsPath = join(geminiDir, 'settings.json')
		await mkdir(geminiDir, { recursive: true })
		await writeFile(settingsPath, '{"theme":"dark"}\n', 'utf8')

		await setupProviderAuth({
			...baseInputs,
			geminiAuthJson: '{"refresh_token":"secret"}',
			provider: ProviderName.Gemini,
		})

		const credentialsPath = join(home, '.gemini', 'oauth_creds.json')
		const settings = JSON.parse(await readFile(settingsPath, 'utf8'))

		expect(await readFile(credentialsPath, 'utf8')).toBe('{"refresh_token":"secret"}')
		expect((await stat(credentialsPath)).mode & 0o777).toBe(0o600)
		expect(settings.theme).toBe('dark')
		expect(settings.security.auth.selectedType).toBe('oauth-personal')
		expect(process.env.GEMINI_CLI_TRUST_WORKSPACE).toBe('true')
	})
})

function makeJwt(exp: number): string {
	return `header.${Buffer.from(JSON.stringify({ exp }), 'utf8').toString('base64url')}.signature`
}
