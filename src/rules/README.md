# Rules boundary

Accepted mechanics will live here as deterministic TypeScript functions with explicit inputs and outputs. This folder must not import Foundry, a browser UI, storage, networking, or implicit randomness. Adapters supply rolled dice and current state; rules return results for the adapter to apply through authorized document operations.

No gameplay rules are implemented yet. Add behavioral examples and edge-case tests with the first accepted rule rather than inventing mechanics to fill the skeleton.
