#!/usr/bin/env sh

set -eu

script_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
manifest="${1:-${script_dir}/../../resources.bdr.gov.au-data/resources/manifest.ttl}"
fuseki_url="${FUSEKI_URL:-http://localhost:3030/refdata/}"
fuseki_user="${FUSEKI_USER:-refdata}"

if [ -z "${REFDATA_PASSWORD:-}" ] && [ -f "${script_dir}/../docker/.env" ]; then
  REFDATA_PASSWORD="$(awk -F= '
    /^SPARQL_PASSWORD=/ { fallback = substr($0, index($0, "=") + 1) }
    /^REFDATA_PASSWORD=/ { password = substr($0, index($0, "=") + 1) }
    END { print (password != "" ? password : fallback) }
  ' "${script_dir}/../docker/.env")"
fi

if [ ! -f "${manifest}" ]; then
  echo "Manifest not found: ${manifest}" >&2
  echo "Pass its path as the first argument or check out resources.bdr.gov.au-data beside this repository." >&2
  exit 1
fi

if [ -z "${REFDATA_PASSWORD:-}" ]; then
  echo "REFDATA_PASSWORD must be set in the environment or docker/.env" >&2
  exit 1
fi

if ! command -v kgm >/dev/null 2>&1; then
  echo "kgm is required; see https://kurrawong.github.io/kgm/" >&2
  exit 1
fi

kgm sync \
  "${manifest}" \
  "${fuseki_url}" \
  -u "${fuseki_user}" \
  -p "${REFDATA_PASSWORD}" \
  True False True False
