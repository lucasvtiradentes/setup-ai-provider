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

	// Step 3: collect provider session files.
	CollectSessionFiles = 'collect-session-files',
	SessionFilesPath = 'session-files-path',

	// Step 4: upload provider session artifact.
	UploadSessionFiles = 'upload-session-files',
	ArtifactName = 'artifact-name',
	RetentionDays = 'retention-days',
}

export enum OutputName {
	ArtifactId = 'artifact-id',
	ArtifactUrl = 'artifact-url',
	Command = 'command',
	Provider = 'provider',
	SessionFilesFound = 'session-files-found',
	SessionFilesPath = 'session-files-path',
}

const CONFIGS = {
	defaults: {
		artifactName: '',
		collectSessionFiles: 'false',
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
	collectSessionFiles: booleanSchema,
	geminiAuthJson: z.string(),
	provider: z.enum(ProviderName),
	retentionDays: z.coerce.number().int().min(1).max(90),
	sessionFilesPath: z.string().min(1),
	uploadSessionFiles: booleanSchema,
})

export type ActionInputs = z.infer<typeof inputsSchema>

export function readInputs(): ActionInputs {
	return inputsSchema.parse({
		artifactName: core.getInput(InputName.ArtifactName),
		claudeCodeOauthToken: core.getInput(InputName.ClaudeCodeOauthToken),
		codexAuthJson: core.getInput(InputName.CodexAuthJson),
		collectSessionFiles: core.getInput(InputName.CollectSessionFiles) || CONFIGS.defaults.collectSessionFiles,
		geminiAuthJson: core.getInput(InputName.GeminiAuthJson),
		provider: core.getInput(InputName.Provider),
		retentionDays: core.getInput(InputName.RetentionDays) || CONFIGS.defaults.retentionDays,
		sessionFilesPath: core.getInput(InputName.SessionFilesPath) || CONFIGS.defaults.sessionFilesPath,
		uploadSessionFiles: core.getInput(InputName.UploadSessionFiles) || CONFIGS.defaults.uploadSessionFiles,
	})
}
