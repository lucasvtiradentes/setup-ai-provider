import * as core from '@actions/core'
import { z } from 'zod'
import { ProviderName } from './providers/shared/types'

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
		artifactName: core.getInput('artifact-name'),
		claudeCodeOauthToken: core.getInput('claude-code-oauth-token'),
		codexAuthJson: core.getInput('codex-auth-json'),
		collectSessionFiles: core.getInput('collect-session-files') || 'false',
		exportEnv: core.getInput('export-env') || 'true',
		geminiCredentials: core.getInput('gemini-credentials'),
		installCli: core.getInput('install-cli') || 'true',
		provider: core.getInput('provider'),
		retentionDays: core.getInput('retention-days') || '7',
		sessionFilesPath: core.getInput('session-files-path') || 'provider-session-files',
		uploadSessionFiles: core.getInput('upload-session-files') || 'false',
	})
}
