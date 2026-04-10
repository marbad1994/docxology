# Document Browser Notes

This app still renders the same `DOCS_DATA -> section.items[]` shape the current UI expects, but it now also defines a recursive `DOCS_CATALOG` model so we can grow beyond two hard-coded levels without breaking the browser.

## Current contract

- `data.js` keeps the legacy section/item output for the app.
- `data.js` also derives `DOCS_CATALOG`, a schema-v1 recursive catalog with `group` and `document` nodes.
- `app.js` normalizes incoming data so missing `items`, `tags`, `formats`, `href`, or titles do not turn into `undefined` at runtime.
- `search-worker.js` normalizes search entries before indexing for the same reason.

## Canonical direction

Use a normalized catalog as the long-term source of truth:

```json
{
  "schema_version": 1,
  "type": "catalog",
  "roots": [
    {
      "type": "group",
      "id": "config",
      "title": "Configuration",
      "children": [
        {
          "type": "group",
          "id": "config:input",
          "title": "Input",
          "children": [
            {
              "type": "document",
              "id": "doc:config:xorg-conf",
              "title": "xorg.conf",
              "href": "man/man5/xorg.conf.5.xhtml",
              "formats": ["xhtml"],
              "tags": ["xorg", "config"]
            }
          ]
        }
      ]
    }
  ]
}
```

## Fetch pipeline

`fetch_docs.py` now writes:

- `search_index.js` for the current app
- `docs.xorg/search_index.json` as data-only search input
- `docs.xorg/catalog.json` as a recursive catalog grouped by path segments
- `docs.xorg/manifest.json` with schema metadata

That lets us preserve current output while moving toward a generic document browser that can import many source types and arbitrary nesting depths.
