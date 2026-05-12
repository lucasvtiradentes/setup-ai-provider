<a name="TOC"></a>

<div align="center">
  <div>Setup AI Provider</div>
  <br />
  <a href="#-overview">Overview</a> • <a href="#-motivation">Motivation</a> • <a href="#-features">Features</a> • <a href="#-setup">Setup</a> • <a href="#-usage">Usage</a> • <a href="#-inputs">Inputs</a> • <a href="#-license">License</a>
</div>

<div width="100%" align="center">
  <img src="https://cdn.jsdelivr.net/gh/lucasvtiradentes/setup-ai-provider@main/.github/images/divider.png" />
</div>

## 🎺 Overview

Setup AI Provider prepares AI coding agent CLIs for GitHub Actions by installing the selected provider, configuring authentication, and optionally uploading raw session files after your workflow steps run.

## ❓ Motivation

I wanted AI coding agents running in CI across many repositories, but duplicating their setup everywhere was getting hard to maintain.

This action keeps that provider setup in one place and makes switching providers a small workflow change.

## ⭐ Features

- One CI setup flow for Claude Code, Codex, and Gemini.
- Provider switching through one workflow input.
- Optional post-step session upload for debugging or formatting with tools like Pretty Session.

## 🚀 Setup

Create the GitHub secrets used by your workflows.

Claude:

```sh
claude setup-token
gh secret set CLAUDE_CODE_OAUTH_TOKEN -b '<token>'
```

Codex:

```sh
gh secret set CODEX_AUTH_JSON < ~/.codex/auth.json
```

Gemini:

```sh
npm install -g @google/gemini-cli
gemini
gh secret set GEMINI_CREDENTIALS < ~/.gemini/oauth_creds.json
```

## 🧰 Usage

```yaml
- uses: lucasvtiradentes/setup-ai-provider@v0.1.0
  with:
    provider: codex
    codex-auth-json: ${{ secrets.CODEX_AUTH_JSON }}
    upload-session-files: 'true'
```

```yaml
- uses: lucasvtiradentes/setup-ai-provider@v0.1.0
  with:
    provider: claude
    claude-code-oauth-token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
```

```yaml
- uses: lucasvtiradentes/setup-ai-provider@v0.1.0
  with:
    provider: gemini
    gemini-auth-json: ${{ secrets.GEMINI_CREDENTIALS }}
```

## 📥 Inputs

<div align="center">

| Input                     | Default                  | Description                                            |
| ------------------------- | ------------------------ | ------------------------------------------------------ |
| `provider`                |                          | Provider to setup: `claude`, `codex`, or `gemini`.     |
| `claude-code-oauth-token` |                          | Claude Code OAuth token.                               |
| `codex-auth-json`         |                          | Content for `~/.codex/auth.json`.                      |
| `gemini-auth-json`        |                          | Content for `~/.gemini/oauth_creds.json`.              |
| `session-files-path`      | `provider-session-files` | Temporary path used during post-step session upload.   |
| `upload-session-files`    | `false`                  | Upload collected session files as an artifact.         |
| `artifact-name`           |                          | Artifact name. Defaults to `<provider>-session-files`. |
| `retention-days`          | `7`                      | Artifact retention days.                               |

</div>

## 📜 License

[MIT](https://github.com/lucasvtiradentes/setup-ai-provider/blob/main/LICENSE)

<div width="100%" align="center">
  <img src="https://cdn.jsdelivr.net/gh/lucasvtiradentes/setup-ai-provider@main/.github/images/divider.png" />
</div>

<br />

<div align="center">
  <div>
    <a target="_blank" href="https://www.linkedin.com/in/lucasvtiradentes/"><img src="https://img.shields.io/badge/-linkedin-blue?logo=Linkedin&logoColor=white" alt="LinkedIn"></a>
    <a target="_blank" href="mailto:lucasvtiradentes@gmail.com"><img src="https://img.shields.io/badge/gmail-red?logo=gmail&logoColor=white" alt="Gmail"></a>
    <a target="_blank" href="https://x.com/lucasvtiradente"><img src="https://img.shields.io/badge/-X-black?logo=X&logoColor=white" alt="X"></a>
    <a target="_blank" href="https://github.com/lucasvtiradentes"><img src="https://img.shields.io/badge/-github-gray?logo=Github&logoColor=white" alt="Github"></a>
  </div>
</div>
