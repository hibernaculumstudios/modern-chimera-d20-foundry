# Contributing

Open an issue describing observable behavior before substantial work. Keep a pull request focused on one result, name the relevant public specification, and include verification commands and results. A contributor must not need a private design repository to understand a task.

## Setup and checks

Use the Node version in `.nvmrc` and run `npm ci`, then `npm run hooks:install`. Run `npm run check` before submitting. For runtime changes, follow [local testing](docs/local-testing.md) and report the Foundry build, system commit, scenarios, and result. Unit tests or type declarations do not prove runtime compatibility.

Read [architecture](docs/architecture.md). Keep rule functions pure, use explicit dependencies, and keep Foundry document writes out of data preparation and rendering. TypeScript strict checks are required. Do not suppress diagnostics or weaken checks to get a passing run. Third-party declaration checking is skipped because the community typings are a separate beta dependency; project code remains checked.

## Source control

Forks and pull requests are welcome; maintainers control merges and releases. Use focused branches and readable commits. Keep machine-specific assistant instructions, session files, credentials, test worlds, generated packages, and local runtime copies out of version control. Local hooks and CI reject prohibited paths and assistant authorship/attribution. Human authorship and legally required third-party notices must remain accurate.

Tracked engineering guidance belongs here and in `docs/`, not local assistant files. Install hooks in each clone; Git does not enable repository hooks automatically. Hooks can be bypassed locally, so CI repeats the checks over tracked files and commit metadata.

## License and review

Contributions to original code and developer documentation are submitted under this repository's MIT license. Do not contribute game prose, art, fonts, or third-party code without identifying its origin and redistribution terms. Brand names and logos are not licensed merely because the implementation is open source.

The initial project has one maintainer. Main requires passing Linux and Windows checks and a pull request, with no force pushes or deletion. A second maintainer enables independent required review without blocking the sole maintainer from merging their own work. The maintainer reviews runtime evidence before merging behavior changes; runtime tests require licensed software and do not run with secrets on untrusted pull requests.
