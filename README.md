<a name="TOC"></a>

<div align="center">
  <div>Setup AI Provider</div>
  <br />
  <a href="#-overview">Overview</a> • <a href="#-motivation">Motivation</a> • <a href="#-features">Features</a> • <a href="#-setup">Setup</a> • <a href="#-inputs">Inputs</a> • <a href="#-license">License</a>
</div>

<div width="100%" align="center">
  <img src="https://cdn.jsdelivr.net/gh/lucasvtiradentes/setup-ai-provider@main/.github/images/divider.png" />
</div>

## 🎺 Overview

Setup AI Provider prepares AI coding agent CLIs for GitHub Actions by installing the selected provider, configuring authentication, and optionally uploading raw session files after your workflow steps run.

## ❓ Motivation

I wanted AI coding agents in CI across many repositories without duplicating setup everywhere. This action keeps provider setup centralized and easy to switch.

## ⭐ Features

- One CI setup flow for [Claude Code](https://claude.com/product/claude-code), [Codex](https://openai.com/codex/), and [Gemini](https://geminicli.com/).
- Provider switching through one workflow input.
- Optional post-step session upload for debugging or formatting with tools like Pretty Session.

## 🚀 Setup

After this action runs, use the provider CLI in the next workflow steps however you want.

### Claude

```sh
claude setup-token
gh secret set CLAUDE_CODE_OAUTH_TOKEN -b '<token>'
```

```yaml
- uses: lucasvtiradentes/setup-ai-provider@v0.1.1
  with:
    provider: claude
    claude-code-oauth-token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
    upload-session-files: 'true' # optional
- run: claude -p "review this pull request" --print --dangerously-skip-permissions
```

### Codex

<div align="center">
<details>
<summary>Show setup</summary>

<div align="left">

<br />

```sh
gh secret set CODEX_AUTH_JSON < ~/.codex/auth.json
```

```yaml
- uses: lucasvtiradentes/setup-ai-provider@v0.1.1
  with:
    provider: codex
    codex-auth-json: ${{ secrets.CODEX_AUTH_JSON }}
    upload-session-files: 'true' # optional
- run: codex exec "review this pull request" --json --dangerously-bypass-approvals-and-sandbox
```

</div>
</details>
</div>

### Gemini

<div align="center">
<details>
<summary>Show setup</summary>

<div align="left">
<br />

```sh
npm install -g @google/gemini-cli
gh secret set GEMINI_CREDENTIALS < ~/.gemini/oauth_creds.json
```

```yaml
- uses: lucasvtiradentes/setup-ai-provider@v0.1.1
  with:
    provider: gemini
    gemini-auth-json: ${{ secrets.GEMINI_CREDENTIALS }}
    upload-session-files: 'true' # optional
- run: gemini -p "review this pull request" --yolo
```

The action also marks the CI workspace as trusted for Gemini CLI runs.

</div>
</details>
</div>

## 📥 Inputs

<br />

<div align="center">

<table>
  <thead>
    <tr>
      <th>Group</th>
      <th width="250">Input</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="4">Auth</td>
      <td><code>provider</code></td>
      <td>Provider to setup: <code>claude</code>, <code>codex</code>, or <code>gemini</code>.</td>
    </tr>
    <tr>
      <td><code>claude-code-oauth-token</code></td>
      <td>Claude Code OAuth token.</td>
    </tr>
    <tr>
      <td><code>codex-auth-json</code></td>
      <td>Content for <code>~/.codex/auth.json</code>.</td>
    </tr>
    <tr>
      <td><code>gemini-auth-json</code></td>
      <td>Content for <code>~/.gemini/oauth_creds.json</code>.</td>
    </tr>
    <tr>
      <td rowspan="4">Session</td>
      <td><code>session-files-path</code></td>
      <td>Temporary path used during post-step session upload. Default: <code>provider-session-files</code>.</td>
    </tr>
    <tr>
      <td><code>upload-session-files</code></td>
      <td>Upload collected session files as an artifact. Default: <code>false</code>.</td>
    </tr>
    <tr>
      <td><code>artifact-name</code></td>
      <td>Artifact name. Default: <code>&lt;provider&gt;-session-files</code>.</td>
    </tr>
    <tr>
      <td><code>retention-days</code></td>
      <td>Artifact retention days. Default: <code>7</code>.</td>
    </tr>
  </tbody>
</table>

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
