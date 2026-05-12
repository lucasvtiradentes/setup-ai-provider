import { mkdir } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import * as core from '@actions/core'
import type { ActionInputs } from '../inputs'
import { type AiProvider, ProviderName } from './shared/types'
import { installNpmPackage, maskJsonSecrets, removeStatePath, writeSecretFile } from './shared/utils'

export class CodexProvider implements AiProvider {
	readonly command = 'codex'
	readonly name = ProviderName.Codex
	readonly sessionDir = '.codex/sessions'

	async install(): Promise<void> {
		await installNpmPackage('@openai/codex')
	}

	async setupAuth(inputs: ActionInputs): Promise<void> {
		if (!inputs.codexAuthJson) {
			return
		}

		maskJsonSecrets(inputs.codexAuthJson)

		const codexDir = join(homedir(), '.codex')
		const authPath = join(codexDir, 'auth.json')
		await mkdir(codexDir, { recursive: true })
		await writeSecretFile(authPath, inputs.codexAuthJson)
		core.saveState('codex-auth-path', authPath)
	}

	async cleanupAuth(): Promise<void> {
		await removeStatePath('codex-auth-path')
	}
}
