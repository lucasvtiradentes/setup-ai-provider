import * as core from '@actions/core'
import { z } from 'zod'
import { ProviderName } from './providers/shared/types'

enum InputName {
	ArtifactName = 'artifact-name',
	ClaudeCodeOauthToken = 'claude-code-oauth-token',
	CodexAuthJson = 'codex-auth-json',
	CollectSessionFiles = 'collect-session-files',
	ExportEnv = 'export-env',
	GeminiCredentials = 'gemini-credentials',
	InstallCli = 'install-cli',
	Provider = 'provider',
	RetentionDays = 'retention-days',
	SessionFilesPath = 'session-files-path',
	UploadSessionFiles = 'upload-session-files',
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
		exportEnv: 'true',
		installCli: 'true',
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
	exportEnv: booleanSchema,
	geminiCredentials: z.string(),
	installCli: booleanSchema,
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
		exportEnv: core.getInput(InputName.ExportEnv) || CONFIGS.defaults.exportEnv,
		geminiCredentials: core.getInput(InputName.GeminiCredentials),
		installCli: core.getInput(InputName.InstallCli) || CONFIGS.defaults.installCli,
		provider: core.getInput(InputName.Provider),
		retentionDays: core.getInput(InputName.RetentionDays) || CONFIGS.defaults.retentionDays,
		sessionFilesPath: core.getInput(InputName.SessionFilesPath) || CONFIGS.defaults.sessionFilesPath,
		uploadSessionFiles: core.getInput(InputName.UploadSessionFiles) || CONFIGS.defaults.uploadSessionFiles,
	})
}
