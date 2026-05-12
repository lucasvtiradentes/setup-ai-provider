#!/usr/bin/env bash

set -euo pipefail

version="$(node -p "require('./package.json').version")"
major="${version%%.*}"
version_tag="v$version"
major_tag="v$major"

tag_exists() {
	local tag="$1"

	git ls-remote --tags origin | grep -q "refs/tags/$tag$"
}

create_version_tag() {
	if tag_exists "$version_tag"; then
		printf 'Tag %s already exists\n' "$version_tag"
		return
	fi

	git tag "$version_tag" "$GITHUB_SHA"
	git push origin "$version_tag"
}

update_major_tag() {
	git config user.name 'github-actions[bot]'
	git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
	git tag -f "$major_tag" "$GITHUB_SHA"
	git push origin "$major_tag" --force
}

main() {
	create_version_tag
	update_major_tag
}

main "$@"
