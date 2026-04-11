# Why the X.Org Archive Exists

This project started by indexing and browsing difficult X.Org documentation. That work is still valuable, but it is now treated as an archived corpus rather than the active product content.

## What was released

The released X.Org bundle lives in the archived corpus under [the local archive manifest](/docs.xorg/manifest.json) and [the local archive catalog](/docs.xorg/catalog.json).

## Why archive it instead of deleting it

- it preserves the original motivation for the project
- it remains a useful reference corpus
- it proves the browser can handle a large documentation set
- it stays separate from the app's own documentation workspace

## What changed

The active use case is no longer “browse X.Org docs only.” The app is now being shaped into a general documentation browser and editor that can host its own project docs as first-class content.

## Practical rule

The archived X.Org content should stay read-only and separate from the current workspace docs unless you explicitly build import tools for it.
