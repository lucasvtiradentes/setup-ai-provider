import { mkdir, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import * as core from '@actions/core'
import type { ActionInputs } from '../inputs'
import { type AiProvider, ProviderName } from './shared/types'
import {
	installNpmPackage,
	maskJsonSecrets,
	readJsonObject,
	readObject,
	removeStatePath,
	writeSecretFile,
} from './shared/utils'

export class GeminiProvider implements AiProvider {
	readonly command = 'gemini'
	readonly name = ProviderName.Gemini
	readonly sessionDir = '.gemini/tmp'

	async install(): Promise<void> {
		await installNpmPackage('@google/gemini-cli')
	}

	async setupAuth(inputs: ActionInputs): Promise<void> {
		if (!inputs.geminiAuthJson) {
			return
		}

		maskJsonSecrets(inputs.geminiAuthJson)

		const geminiDir = join(homedir(), '.gemini')
		const credentialsPath = join(geminiDir, 'oauth_creds.json')
		const settingsPath = join(geminiDir, 'settings.json')
		await mkdir(geminiDir, { recursive: true })
		await writeSecretFile(credentialsPath, inputs.geminiAuthJson)
		await writeFile(settingsPath, `${JSON.stringify(await this.mergeSettings(settingsPath), null, 2)}\n`, 'utf8')
		core.saveState('gemini-auth-json-path', credentialsPath)
	}

	async cleanupAuth(): Promise<void> {
		await removeStatePath('gemini-auth-json-path')
	}

	private async mergeSettings(path: string): Promise<Record<string, unknown>> {
		const settings = await readJsonObject(path)
		const security = readObject(settings.security)
		const auth = readObject(security.auth)

		return {
			...settings,
			security: {
				...security,
				auth: {
					...auth,
					selectedType: 'oauth-personal',
				},
			},
		}
	}
}
