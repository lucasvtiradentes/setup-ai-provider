#!/usr/bin/env bash

set -euo pipefail

read_current_version() {
	node -p "require('./package.json').version"
}

read_previous_version() {
	git show 'HEAD~1:package.json' 2>/dev/null | node -e "const fs = require('node:fs'); try { const packageJson = JSON.parse(fs.readFileSync(0, 'utf8')); process.stdout.write(packageJson.version); } catch { process.stdout.write(''); }"
}

version_increased() {
	local current_version="$1"
	local previous_version="$2"

	node -e "
const current = process.argv[1];
const previous = process.argv[2];
const parse = (value) => value.split('-')[0].split('.').map((part) => Number(part));
const [currentMajor = 0, currentMinor = 0, currentPatch = 0] = parse(current);
const [previousMajor = 0, previousMinor = 0, previousPatch = 0] = parse(previous);
const increased =
	currentMajor > previousMajor ||
	(currentMajor === previousMajor && currentMinor > previousMinor) ||
	(currentMajor === previousMajor && currentMinor === previousMinor && currentPatch > previousPatch);
process.exit(increased ? 0 : 1);
" "$current_version" "$previous_version"
}

tag_missing() {
	local tag="$1"

	! git ls-remote --tags origin 2>/dev/null | grep -q "refs/tags/$tag$"
}

write_result() {
	local name="$1"
	local value="$2"

	if [ -n "${GITHUB_OUTPUT:-}" ]; then
		printf '%s=%s\n' "$name" "$value" >> "$GITHUB_OUTPUT"
	else
		printf '%s=%s\n' "$name" "$value"
	fi
}

current_version="$(read_current_version)"
previous_version="$(read_previous_version)"
should_release_action=false

printf 'Checking package.json: current=%s previous=%s\n' "$current_version" "${previous_version:-missing}"

if [ -n "$previous_version" ] && version_increased "$current_version" "$previous_version" && tag_missing "v$current_version"; then
	should_release_action=true
fi

write_result should_release_action "$should_release_action"
