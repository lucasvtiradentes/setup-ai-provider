import * as core from '@actions/core'
import * as exec from '@actions/exec'
import type { ActionInputs } from '../inputs/inputs'
import type { AiProvider } from './shared/types'
import { ProviderName } from './shared/types'

export class ClaudeProvider implements AiProvider {
	readonly command = 'claude'
	readonly name = ProviderName.Claude
	readonly sessionDir = '.claude/projects'

	async install(): Promise<void> {
		await exec.exec('bash', ['-c', 'curl -fsSL https://claude.ai/install.sh | bash'])
	}

	async setupAuth(inputs: ActionInputs): Promise<void> {
		if (!inputs.claudeCodeOauthToken) {
			return
		}

		core.setSecret(inputs.claudeCodeOauthToken)
		core.exportVariable('CLAUDE_CODE_OAUTH_TOKEN', inputs.claudeCodeOauthToken)
	}

	async cleanupAuth(): Promise<void> {}
}
