# Security

Report security vulnerabilities through this repository's GitHub private vulnerability reporting feature. Avoid publishing credentials, private world data, or exploit details in a public issue. For ordinary reproducible bugs, use the issue tracker.

The current development line is supported. No stable release exists yet.

Local runtime secrets and world data belong in ignored `.local/`. Public CI has no Foundry account credentials and never executes pull-request code on the local development host. Dependencies are pinned in the lockfile; review updates rather than applying forced audit downgrades.

The V14 community type package currently pulls Showdown 2.1.0 as a development dependency. The initial audit reports moderate advisories in that transitive dependency. It is used only to supply declarations and is not imported into the system bundle. Do not use it to process content; reassess when the type package updates. `npm audit --omit=dev` checks shipped dependencies separately. This is a recorded limitation, not a claim of a clean full audit.
