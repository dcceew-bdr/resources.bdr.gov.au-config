# BDR Reference Data Catalogue

This repository contains the configuration needed for the configuration of the [Prez](https://prez.dev) tool, as 
deployed for the [Biodiversity Data repository](https://bdr.gov.au)'s reference data catalogue at <https://resources.bdr.gov.au>.

## The tool

The tool used here is [Prez](https://prez.dev/), which is a Linked Data API and UI that makes RDF data available on the
web for humans and machines.

The Prez API is deployed to the Azure Cloud using a Functions app and the UI is an Azure container app. The database 
containing the RDF data is a [Fuseki](https://jena.apache.org/documentation/fuseki2/) instance within the BDR's cloud
tenancy.

## Running

### Prerequisites

- [Docker](https://docs.docker.com/engine/install/), including Docker Compose
- [Task](https://taskfile.dev/installation/)

### Configuration

Create the local environment file:

```bash
cp docker/.env.example docker/.env
```

Set `FUSEKI_ADMIN_PASSWORD` and `REFDATA_PASSWORD` in `docker/.env`. The latter is used by the dedicated `refdata`
account shared by the local Fuseki dataset, Prez, and the data loader.

### Running the stack

Build both images:

```bash
task stack:build
```

Start the stack:

```bash
task stack:up
```

This starts Fuseki first and then starts Prez and PrezUI against its `refdata` dataset. Open the catalogue UI at
<http://localhost:3000/catalogs> or the Fuseki UI at <http://localhost:3030/>.

### Loading the reference data

Check out `resources.bdr.gov.au-data` beside this repository and install
[kgm](https://kurrawong.github.io/kgm/). With the stack healthy, load its manifest into the local dataset:

```bash
task data:sync
task fuseki:restart
```

The sync task is the local equivalent of that repository's `resources/kgm-sync.sh`: it reads
`../resources.bdr.gov.au-data/resources/manifest.ttl`, targets `http://localhost:3030/refdata/`, and authenticates as
`refdata`. You may instead pass another manifest directly to `fuseki/kgm-sync.sh`. Restart Fuseki after a load so its
on-disk GeoSPARQL index is rebuilt from the newly loaded data; the Lucene full-text index is maintained during updates.

Other stack commands are:

```bash
task stack:restart
task stack:logs
task stack:down
task stack:clean
```

`stack:clean` removes the stack-owned `fuseki-data` volume and all locally loaded RDF data.

### Running with the Azure Functions emulator

This mode runs the Prez API through Azure Functions Core Tools on port 7071 and
serves a separate UI image configured to use that port.

Prerequisites in addition to Docker and Task are:

- Python 3.12
- [uv](https://docs.astral.sh/uv/)
- Azure Functions Core Tools 4

Create the untracked local Function settings and set the Fuseki password:

```bash
cp prez/local.settings.example.json prez/local.settings.json
```

Build the Functions environment and UI image:

```bash
task functions:build
```

Then:

```bash
task functions:dev
```

`functions:dev` starts the Functions-mode UI in Docker and runs Azure Functions
Core Tools in the foreground. The services are then available at:

- Prez UI: <http://localhost:3000/catalogs>
- Emulated Function App: <http://localhost:7071>

Press Ctrl+C to stop the Functions host, then stop its UI with:

```bash
task functions:down
```

## Services

- **Prez UI:** <http://localhost:3000>
- **Prez API:** <http://localhost:8000>
- **Fuseki:** <http://localhost:3030/refdata/> (persistent TDB2 with Lucene full-text and GeoSPARQL indexes)

## Deploying to Azure

The development deployment uses two independent Azure application resources:

- Prez runs in a Python 3.12 Azure Function App on the Flex Consumption plan.
- PrezUI is generated as a client-side Nuxt site and deployed to Azure Static Web Apps.

Fuseki runs separately on the VM managed by `resources.bdr.gov.au-infra`.

The workflows under `.github/workflows/` deploy both applications when relevant
files change on `main`. Apply `resources.bdr.gov.au-infra` before enabling them.

### Function App

The Linux Flex Consumption Function App, storage account, Application Insights,
settings, and Key Vault reference are managed by `resources.bdr.gov.au-infra`.
The effective application settings include:

```text
AzureWebJobsFeatureFlags=EnableWorkerIndexing
SPARQL_REPO_TYPE=remote
SPARQL_ENDPOINT=https://fuseki.resources.dev.bdr.gov.au/refdata/sparql
SPARQL_USERNAME=refdata
SPARQL_PASSWORD=<secret>
ENABLE_SPARQL_ENDPOINT=true
FUNCTION_APP_AUTH_LEVEL=ANONYMOUS
FUNCTION_APP_ROOT_PATH=
CORS_ALLOWED_ORIGIN=https://resources.dev.bdr.gov.au
```

Do not add `FUNCTIONS_WORKER_RUNTIME` to the deployed Function App. Flex
Consumption configures Python 3.12 through the Function runtime properties and
rejects that legacy app setting. It remains in `prez/local.settings.example.json`
because Azure Functions Core Tools requires it for local development.

The Function must be anonymous because a Function key cannot safely be embedded
in the static browser application. Store the SPARQL password in Azure application
settings or use a Key Vault reference. Do not publish `local.settings.json`.

The deployment workflow uses GitHub OIDC. Configure a federated Azure identity
for this repository and grant it permission to deploy to the Function App. Add
these non-secret GitHub Actions repository or `dev` environment variables:

```text
AZURE_CLIENT_ID
AZURE_TENANT_ID
AZURE_SUBSCRIPTION_ID
```

Also add this GitHub Actions repository or `dev` environment variable:

```text
AZURE_FUNCTION_APP_NAME=resources-bdr-dev-prez-0zlag
```

The workflow in `.github/workflows/deploy-prez.yml` exports the locked `uv`
environment to `requirements.txt` and asks Azure to perform the Flex Consumption
remote build. The generated file remains ignored locally.

### Static Web App

The Static Web App is managed by `resources.bdr.gov.au-infra`. Store its
sensitive Terraform deployment-token output as this GitHub Actions repository
or `dev` environment secret:

```text
AZURE_STATIC_WEB_APPS_API_TOKEN=<deployment token>
```

Add the public Function endpoint as a GitHub Actions repository or `dev`
environment variable. It has no `/api` suffix because `prez/host.json` sets an
empty Functions route prefix:

```text
PREZ_API_ENDPOINT=https://resources-bdr-dev-prez-0zlag.azurewebsites.net
```

The workflow in `.github/workflows/deploy-prez-ui.yml` builds the existing
PrezUI Dockerfile with this endpoint, extracts the generated static files, and
deploys them to Static Web Apps. This deliberately reuses the same Docker build
as local testing. `prez-ui/overrides/public/staticwebapp.config.json` provides
the fallback needed when browser routes such as `/catalogs` are opened directly.

After Azure assigns the Static Web App hostname, set `CORS_ALLOWED_ORIGIN` on the
Function App to that exact origin. If a custom UI domain is added later, update
both that setting and any configured Azure platform CORS rules. Do not configure
both the application middleware and Azure platform CORS to emit duplicate CORS
headers.

### Deployment checks

After the first deployment, verify:

```text
https://<Function App resource name>.azurewebsites.net/health
https://<Function App resource name>.azurewebsites.net/catalogs
https://<Static Web App hostname>/catalogs
```

Browser network requests from PrezUI should go directly to the Function hostname,
must not contain `localhost` or `/api`, and must return exactly one matching
`Access-Control-Allow-Origin` header.

## Image layout

The root `Dockerfile` extends the selected Prez image and copies the configuration
under `prez/config` into the image. The files are stored directly in this repository
so Docker builds do not depend on absolute symlinks or another source checkout.

`prez-ui/Dockerfile` creates an unmodified Prez UI application at the
selected version, generates the static site, and copies it into an Nginx runtime
image.

`docker-compose.yml` builds and runs the three images. The browser-facing API endpoint
is embedded into the static UI at build time through
`NUXT_PUBLIC_PREZ_API_ENDPOINT`.

The derived image under `fuseki/` pins the Kurrawong Fuseki image and supplies the `refdata` dataset assembler and
dedicated user. The assembler wraps a GeoSPARQL-enabled TDB2 dataset in a Lucene `text:TextDataset`; Fuseki exposes the
outer text dataset so both indexes are available to Prez.

The `functions` Compose profile builds only the UI, targeting the local Azure
Functions host at port 7071. The Python Function App under `prez/` merges Prez's
packaged reference data with `prez/config` before assembling the ASGI application.
Both deployment modes wrap Prez with repository-owned response middleware that
removes upstream hop-by-hop headers and emits browser-safe CORS headers. Set
`CORS_ALLOWED_ORIGIN` to the deployed Prez UI origin in Azure.

## License & Copyright

The license for novel content in this repository is the standard Australian government open source license:

* [CC BY 4.0 - Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)

Copyright is

© Department of Climate Change, Energy, the Environment and Water

## Contacts

**Biodiversity Data Repository Team**  
[Department of Climate Change, Energy, the Environment and Water](https://www.dcceew.gov.au)  
<https://bdr.gov.au>  
<bdr@dcceew.gov.au>

For technical contributions, please use the [Issue Tracker](https://github.com/dcceew-bdr/resources.bdr.gov.au-data/issues) 
for this repository.
