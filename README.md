# Docxology

This started with me asking claude to create a searchable and formatted documentation viewer for the X.Org documentation since it's very hard to read and a lot of pages. After it was useful to me several times I decided to deploy it for everyone to enjoy. It's deployed here with a AI widget for help: [Xorg Docxology](https://marcus-bader.taild8e48a.ts.net/xorg-docs)

Then I thought that it was actually a pretty good tool so I asked codex to make it a simple tool for documentation.
So yes it is vibe coded and yes it is a mess but it works okay for now. It's just the outcome of something I needed in the moment.

The user guide can be found here: [Docxology Documentation](https://marbad1994.github.io/docxology/)

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
