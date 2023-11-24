#!/usr/bin/env bash

v="$(jq -r .version < manifest.json)"
zip "save-svg-$v.zip" manifest.json background.js
git tag "v$v" -am "Version $v release"
