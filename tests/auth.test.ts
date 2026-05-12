import { mkdir, mkdtemp, readFile, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import type { ActionInputs } from '../src/inputs/inputs'
import { setupProviderAuth } from '../src/providers/shared/auth'
import { ProviderName } from '../src/providers/shared/types'

const baseInputs: ActionInputs = {
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

afterEach(() => {
	process.env.HOME = originalHome
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
	})
})
