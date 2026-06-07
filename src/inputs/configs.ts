import { z } from 'zod'

export const CONFIGS = {
	defaults: {
		additionalConsumers: '',
		artifactName: '',
		retentionDays: '7',
		sessionFilesPath: 'provider-session-files',
		uploadSessionFiles: 'false',
	},
}

export const booleanSchema = z
	.string()
	.trim()
	.toLowerCase()
	.refine((value) => ['true', 'false', '1', '0', 'yes', 'no'].includes(value), {
		message: 'Expected a boolean value',
	})
	.transform((value) => value === 'true' || value === '1' || value === 'yes')
