import { chmod, readFile, rm, writeFile } from 'node:fs/promises'
import * as core from '@actions/core'
import * as exec from '@actions/exec'

export async function installNpmPackage(packageName: string): Promise<void> {
	await exec.exec('npm', ['install', '--global', packageName])
}

export async function writeSecretFile(path: string, content: string): Promise<void> {
	await writeFile(path, content, 'utf8')
	await chmod(path, 0o600)
}

export async function removeStatePath(name: string): Promise<void> {
	const path = core.getState(name)

	if (!path) {
		return
	}

	await rm(path, { force: true })
}

export async function readJsonObject(path: string): Promise<Record<string, unknown>> {
	try {
		const content = await readFile(path, 'utf8')
		return readObject(JSON.parse(content))
	} catch {
		return {}
	}
}

export function readObject(value: unknown): Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return {}
	}

	return value as Record<string, unknown>
}

export function maskJsonSecrets(content: string): void {
	core.setSecret(content)

	try {
		maskJsonValue(JSON.parse(content))
	} catch {
		return
	}
}

function maskJsonValue(value: unknown): void {
	if (typeof value === 'string') {
		return
	}

	if (Array.isArray(value)) {
		for (const item of value) {
			maskJsonValue(item)
		}
		return
	}

	if (!value || typeof value !== 'object') {
		return
	}

	for (const [key, item] of Object.entries(value)) {
		if (typeof item === 'string' && isSecretKey(key)) {
			core.setSecret(item)
		}
		maskJsonValue(item)
	}
}

function isSecretKey(key: string): boolean {
	const normalized = key.toLowerCase()
	return (
		normalized === 'token' ||
		normalized.endsWith('_token') ||
		normalized.endsWith('token') ||
		normalized === 'api_key' ||
		normalized === 'client_secret' ||
		normalized === 'password' ||
		normalized === 'secret'
	)
}
