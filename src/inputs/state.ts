import * as core from '@actions/core'
import { CONFIGS } from './configs'
import { type ActionInputs, inputsSchema } from './inputs'

enum StateName {
	ArtifactName = 'artifact-name',
	Provider = 'provider',
	RetentionDays = 'retention-days',
	SessionFilesPath = 'session-files-path',
	UploadSessionFiles = 'upload-session-files',
}

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
