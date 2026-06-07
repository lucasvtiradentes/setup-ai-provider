import { mkdir, readFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import * as core from '@actions/core'
import type { ActionInputs } from '../inputs/inputs'
import { ProviderName } from '../providers/shared/types'
import {
	maskJsonSecrets,
	readJsonObject,
	readObject,
	removeStatePath,
	writeSecretFile,
} from '../providers/shared/utils'

type PiAuth = Record<string, unknown>

const PI_AUTH_STATE_KEY = 'pi-auth-path'

export async function setupPiConsumer(inputs: ActionInputs): Promise<void> {
	if (inputs.provider !== ProviderName.Codex) {
		throw new Error(`Pi consumer does not support provider ${inputs.provider} yet`)
	}

	await setupPiCodexAuth(inputs)
}

export async function cleanupPiConsumer(): Promise<void> {
	await removeStatePath(PI_AUTH_STATE_KEY)
}

async function setupPiCodexAuth(inputs: ActionInputs): Promise<void> {
	const codexAuthJson = await readCodexAuthJson(inputs)
	if (!codexAuthJson) {
		return
	}

	maskJsonSecrets(codexAuthJson)
	const codexAuth = readObject(JSON.parse(codexAuthJson))
	const tokens = readObject(codexAuth.tokens)
	const access = readString(tokens.access_token)
	const refresh = readString(tokens.refresh_token)
	if (!access || !refresh) {
		throw new Error('Codex auth JSON is missing tokens.access_token or tokens.refresh_token')
	}

	const piDir = join(homedir(), '.pi', 'agent')
	const authPath = join(piDir, 'auth.json')
	await mkdir(piDir, { recursive: true })
	const piAuth: PiAuth = await readJsonObject(authPath)
	piAuth['openai-codex'] = {
		type: 'oauth',
		access,
		refresh,
		expires: getJwtExpires(access) ?? Date.now() + 50 * 60 * 1000,
		accountId: readString(tokens.account_id),
	}

	await writeSecretFile(authPath, `${JSON.stringify(piAuth, null, 2)}\n`)
	core.saveState(PI_AUTH_STATE_KEY, authPath)
}

async function readCodexAuthJson(inputs: ActionInputs): Promise<string> {
	if (inputs.codexAuthJson) return inputs.codexAuthJson

	try {
		return await readFile(join(homedir(), '.codex', 'auth.json'), 'utf8')
	} catch {
		return ''
	}
}

function readString(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined
}

function getJwtExpires(token: string): number | undefined {
	const payload = token.split('.')[1]
	if (!payload) return undefined

	try {
		const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { exp?: number }
		return decoded.exp ? decoded.exp * 1000 : undefined
	} catch {
		return undefined
	}
}
