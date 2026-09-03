# Prez configuration

The endpoint and profile definitions under `config/` are copied into the Prez API
image by the repository's root `Dockerfile`.

## Azure Functions

This directory is also an Azure Functions Python project. It wraps Prez's ASGI
application, uses the remote SPARQL repository configured in `local.settings.json`,
and merges `config/` with Prez's packaged reference data at startup.

From the repository root, prepare and run it with:

```bash
task prez:uv:sync
task prez:dev
```

The local Functions host listens on <http://localhost:7071>. Copy
`local.settings.example.json` to the ignored `local.settings.json` before first use.

For Azure deployment, the repository workflow exports `uv.lock` to a temporary
`requirements.txt` without pip hashes and deploys this directory with Azure's
Python remote build. Hashes are omitted because pip cannot hash the locked Git
dependencies. The duplicate direct `rdf2geojson` requirement is omitted because
Prez already pins it by tag with the required `oxigraph` extra; emitting both
tag and commit URL forms causes pip to report a dependency conflict.
Configure production values as Function App environment variables; Azure does not
publish or read `local.settings.json` in production. See the repository root
README for the required Azure and GitHub settings.
