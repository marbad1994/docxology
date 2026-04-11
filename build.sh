#!/bin/bash
set -euo pipefail

BUILD_DIR="build"

rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/content"

cp index.html "$BUILD_DIR/index.html"
cp app.js "$BUILD_DIR/app.js"
cp style.css "$BUILD_DIR/style.css"
cp -R content/. "$BUILD_DIR/content/"
if [ -d assets ]; then
  cp -R assets "$BUILD_DIR/assets"
fi
cp -R assets/. "$BUILD_DIR/assets/"

if [ -d docs.xorg ]; then
  cp -R docs.xorg "$BUILD_DIR/docs.xorg"
fi

cat > "$BUILD_DIR/release-config.js" <<'EOF2'
window.__DOC_WORKSPACE_RELEASE__ = true;
EOF2

python3 - <<'PY2'
from pathlib import Path
import json

build_dir = Path('build')
content_dir = Path('content')
manifest = json.loads((content_dir / 'workspace.json').read_text())

docs = []
for doc in manifest.get('docs', []):
    item = dict(doc)
    source_path = item.get('sourcePath')
    source_text = item.get('sourceText', '')
    if source_path and not source_text:
        source_file = Path(source_path)
        if not source_file.is_absolute():
            source_file = Path('.') / source_file
        source_text = source_file.read_text()
    item['sourceText'] = source_text
    docs.append(item)

payload = dict(manifest)
payload['docs'] = docs
(build_dir / 'build-content.js').write_text(
    'window.__DOC_WORKSPACE_CONTENT__ = ' + json.dumps(payload, ensure_ascii=False) + ';\n'
)

index_path = build_dir / 'index.html'
text = index_path.read_text()
marker = '<script src="app.js"></script>'
replacement = '<script src="release-config.js"></script>\n    <script src="build-content.js"></script>\n    <script src="app.js"></script>'
if marker not in text:
    raise SystemExit('Could not find app.js script tag in build/index.html')
index_path.write_text(text.replace(marker, replacement, 1))
PY2

echo "Static release build ready in $BUILD_DIR/"
