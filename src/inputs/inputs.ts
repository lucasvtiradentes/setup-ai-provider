import * as core from '@actions/core'
import { z } from 'zod'
import { ProviderName } from '../providers/shared/types'
import { CONFIGS, booleanSchema } from './configs'

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

export const inputsSchema = z.object({
	// Step 1: select provider.
	provider: z.enum(ProviderName),

	// Step 2: setup provider auth.
	claudeCodeOauthToken: z.string(),
	codexAuthJson: z.string(),
	geminiAuthJson: z.string(),

	// Step 3: upload provider session artifact.
	artifactName: z.string(),
	retentionDays: z.coerce.number().int().min(1).max(90),
	sessionFilesPath: z.string().min(1),
	uploadSessionFiles: booleanSchema,
})

export type ActionInputs = z.infer<typeof inputsSchema>

export function readInputs(): ActionInputs {
	return inputsSchema.parse({
		// Step 1: select provider.
		provider: core.getInput(InputName.Provider),

		// Step 2: setup provider auth.
		claudeCodeOauthToken: core.getInput(InputName.ClaudeCodeOauthToken),
		codexAuthJson: core.getInput(InputName.CodexAuthJson),
		geminiAuthJson: core.getInput(InputName.GeminiAuthJson),

		// Step 3: upload provider session artifact.
		artifactName: core.getInput(InputName.ArtifactName),
		retentionDays: core.getInput(InputName.RetentionDays) || CONFIGS.defaults.retentionDays,
		sessionFilesPath: core.getInput(InputName.SessionFilesPath) || CONFIGS.defaults.sessionFilesPath,
		uploadSessionFiles: core.getInput(InputName.UploadSessionFiles) || CONFIGS.defaults.uploadSessionFiles,
	})
}
