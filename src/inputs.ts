import * as core from '@actions/core'
import { z } from 'zod'
import { ProviderName } from './providers/shared/types'

enum InputName {
	// Step 1: select provider.
	Provider = 'provider',

	// Step 2: setup provider auth.
	ClaudeCodeOauthToken = 'claude-code-oauth-token',
	CodexAuthJson = 'codex-auth-json',
	GeminiAuthJson = 'gemini-auth-json',

	// Step 3: upload provider session artifact.
	SessionFilesPath = 'session-files-path',
	UploadSessionFiles = 'upload-session-files',
	ArtifactName = 'artifact-name',
	RetentionDays = 'retention-days',
}

enum StateName {
	ArtifactName = 'artifact-name',
	Provider = 'provider',
	RetentionDays = 'retention-days',
	SessionFilesPath = 'session-files-path',
	UploadSessionFiles = 'upload-session-files',
}

export enum OutputName {
	Command = 'command',
	Provider = 'provider',
}

const CONFIGS = {
	defaults: {
		artifactName: '',
		retentionDays: '7',
		sessionFilesPath: 'provider-session-files',
		uploadSessionFiles: 'false',
	},
}

const booleanSchema = z
	.string()
	.trim()
	.toLowerCase()
	.refine((value) => ['true', 'false', '1', '0', 'yes', 'no'].includes(value), {
		message: 'Expected a boolean value',
	})
	.transform((value) => value === 'true' || value === '1' || value === 'yes')

const inputsSchema = z.object({
	artifactName: z.string(),
	claudeCodeOauthToken: z.string(),
	codexAuthJson: z.string(),
	geminiAuthJson: z.string(),
	provider: z.enum(ProviderName),
	retentionDays: z.coerce.number().int().min(1).max(90),
	sessionFilesPath: z.string().min(1),
	uploadSessionFiles: booleanSchema,
})

export type ActionInputs = z.infer<typeof inputsSchema>
export type SessionInputs = Pick<
	ActionInputs,
	'artifactName' | 'provider' | 'retentionDays' | 'sessionFilesPath' | 'uploadSessionFiles'
>

const sessionInputsSchema = inputsSchema.pick({
	artifactName: true,
	provider: true,
	retentionDays: true,
	sessionFilesPath: true,
	uploadSessionFiles: true,
})

export function readInputs(): ActionInputs {
	return inputsSchema.parse({
		artifactName: core.getInput(InputName.ArtifactName),
		claudeCodeOauthToken: core.getInput(InputName.ClaudeCodeOauthToken),
		codexAuthJson: core.getInput(InputName.CodexAuthJson),
		geminiAuthJson: core.getInput(InputName.GeminiAuthJson),
		provider: core.getInput(InputName.Provider),
		retentionDays: core.getInput(InputName.RetentionDays) || CONFIGS.defaults.retentionDays,
		sessionFilesPath: core.getInput(InputName.SessionFilesPath) || CONFIGS.defaults.sessionFilesPath,
		uploadSessionFiles: core.getInput(InputName.UploadSessionFiles) || CONFIGS.defaults.uploadSessionFiles,
	})
}

export function saveSessionInputs(inputs: SessionInputs): void {
	core.saveState(StateName.ArtifactName, inputs.artifactName)
	core.saveState(StateName.Provider, inputs.provider)
	core.saveState(StateName.RetentionDays, String(inputs.retentionDays))
	core.saveState(StateName.SessionFilesPath, inputs.sessionFilesPath)
	core.saveState(StateName.UploadSessionFiles, String(inputs.uploadSessionFiles))
}

export function readSessionInputs(): SessionInputs | null {
	const provider = core.getState(StateName.Provider)

	if (!provider) {
		return null
	}

	return sessionInputsSchema.parse({
		artifactName: core.getState(StateName.ArtifactName),
		provider,
		retentionDays: core.getState(StateName.RetentionDays) || CONFIGS.defaults.retentionDays,
		sessionFilesPath: core.getState(StateName.SessionFilesPath) || CONFIGS.defaults.sessionFilesPath,
		uploadSessionFiles: core.getState(StateName.UploadSessionFiles) || CONFIGS.defaults.uploadSessionFiles,
	})
}
