# setup-ai-provider

GitHub Action for installing and authenticating AI provider CLIs.

Supported providers:

- `claude`
- `codex`
- `gemini`

## Usage

```yaml
- uses: lucasvtiradentes/setup-ai-provider@v0
  with:
    provider: claude
    claude-code-oauth-token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
```

```yaml
- uses: lucasvtiradentes/setup-ai-provider@v0
  with:
    provider: gemini
    gemini-auth-json: ${{ secrets.GEMINI_AUTH_JSON }}
```

```yaml
- uses: lucasvtiradentes/setup-ai-provider@v0
  with:
    provider: codex
    codex-auth-json: ${{ secrets.CODEX_AUTH_JSON }}
```

```yaml
- uses: lucasvtiradentes/setup-ai-provider@v0
  with:
    provider: gemini
    gemini-auth-json: ${{ secrets.GEMINI_AUTH_JSON }}
    collect-session-files: 'true'
    upload-session-files: 'true'
```

Claude uses the official upstream installer script.

## Inputs

| Input                     | Default                  | Description                                            |
|---------------------------|--------------------------|--------------------------------------------------------|
| `provider`                |                          | Provider to setup: `claude`, `codex`, or `gemini`.     |
| `claude-code-oauth-token` |                          | Claude Code OAuth token.                               |
| `codex-auth-json`         |                          | Content for `~/.codex/auth.json`.                      |
| `gemini-auth-json`        |                          | Content for `~/.gemini/oauth_creds.json`.              |
| `collect-session-files`   | `false`                  | Copy provider session files into `session-files-path`. |
| `session-files-path`      | `provider-session-files` | Destination for collected session files.               |
| `upload-session-files`    | `false`                  | Upload collected session files as an artifact.         |
| `artifact-name`           |                          | Artifact name. Defaults to `<provider>-session-files`. |
| `retention-days`          | `7`                      | Artifact retention days.                               |

## Outputs

| Output                | Description                                   |
|-----------------------|-----------------------------------------------|
| `provider`            | Selected provider.                            |
| `command`             | Provider CLI command name.                    |
| `session-files-path`  | Directory containing collected session files. |
| `session-files-found` | Whether provider session files were found.    |
| `artifact-id`         | Uploaded artifact ID when upload is enabled.  |
| `artifact-url`        | Uploaded artifact URL when upload is enabled. |
