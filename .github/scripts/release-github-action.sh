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

create_version_release() {
	if tag_exists "$version_tag"; then
		printf 'Tag %s already exists\n' "$version_tag"
		return
	fi

	gh release create "$version_tag" \
		--title "$version_tag" \
		--generate-notes \
		--target "$GITHUB_SHA"
}

update_major_tag() {
	git config user.name 'github-actions[bot]'
	git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
	git tag -f "$major_tag" "$GITHUB_SHA"
	git push origin "$major_tag" --force
}

main() {
	create_version_release
	update_major_tag
}

main "$@"
