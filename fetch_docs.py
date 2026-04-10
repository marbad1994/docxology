#!/usr/bin/env python3
"""
Recursively fetch all X.org documentation and save locally.
Converts HTML to clean content, preserves structure.
"""

import os
import re
import json
import time
import urllib.request
import urllib.error
from html.parser import HTMLParser
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = 'https://www.x.org/releases/current/doc/'
OUT_DIR = Path(__file__).parent / 'docs.xorg'
INDEX_FILE = Path(__file__).parent / 'search_index.js'
SEARCH_JSON_FILE = OUT_DIR / 'search_index.json'
CATALOG_FILE = OUT_DIR / 'catalog.json'

# Rate limiting
REQUEST_DELAY = 0.1  # seconds between requests
MAX_WORKERS = 4


class HTMLTextExtractor(HTMLParser):
    """Extract visible text from HTML, preserving some structure."""
    def __init__(self):
        super().__init__()
        self.result = []
        self.skip_tags = {'script', 'style', 'head', 'meta', 'link', 'noscript'}
        self.block_tags = {'p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                          'li', 'tr', 'br', 'hr', 'pre', 'blockquote', 'dt', 'dd',
                          'table', 'section', 'article', 'header', 'footer'}
        self.current_skip = 0
        self.in_pre = 0

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if tag in self.skip_tags:
            self.current_skip += 1
        if tag == 'pre':
            self.in_pre += 1
        if tag in self.block_tags and self.current_skip == 0:
            self.result.append('\n')
        if tag == 'td' or tag == 'th':
            self.result.append('\t')

    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag in self.skip_tags:
            self.current_skip = max(0, self.current_skip - 1)
        if tag == 'pre':
            self.in_pre = max(0, self.in_pre - 1)
        if tag in self.block_tags and self.current_skip == 0:
            self.result.append('\n')

    def handle_data(self, data):
        if self.current_skip == 0:
            self.result.append(data)

    def get_text(self):
        text = ''.join(self.result)
        # Clean up multiple blank lines
        text = re.sub(r'\n{3,}', '\n\n', text)
        # Clean up leading/trailing whitespace per line
        lines = [line.rstrip() for line in text.split('\n')]
        text = '\n'.join(lines).strip()
        return text


class HTMLTitleExtractor(HTMLParser):
    """Extract <title> from HTML."""
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.title = ''

    def handle_starttag(self, tag, attrs):
        if tag.lower() == 'title':
            self.in_title = True

    def handle_endtag(self, tag):
        if tag.lower() == 'title':
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


class LinkExtractor(HTMLParser):
    """Extract all links from an HTML page."""
    def __init__(self, base_url):
        super().__init__()
        self.base_url = base_url
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag.lower() == 'a':
            for name, value in attrs:
                if name == 'href' and value:
                    # Skip anchors, external links, parent dirs
                    if value.startswith('#') or value.startswith('mailto:'):
                        continue
                    if value.startswith('http') and 'x.org/releases/current/doc' not in value:
                        continue
                    if value == '../' or value == '../../':
                        continue
                    self.links.append(value)


def fetch_url(url, retries=3):
    """Fetch a URL and return (content_bytes, content_type)."""
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={
                'User-Agent': 'XorgDocsFetcher/1.0 (documentation archiver)'
            })
            with urllib.request.urlopen(req, timeout=30) as resp:
                content = resp.read()
                ctype = resp.headers.get('Content-Type', '')
                return content, ctype
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:
            if attempt < retries - 1:
                time.sleep(1 * (attempt + 1))
            else:
                print(f"  FAILED: {url} - {e}")
                return None, None


def extract_text(html_bytes, encoding='utf-8'):
    """Extract plain text from HTML bytes."""
    try:
        html_str = html_bytes.decode(encoding, errors='replace')
    except:
        html_str = html_bytes.decode('latin-1', errors='replace')

    extractor = HTMLTextExtractor()
    try:
        extractor.feed(html_str)
    except:
        pass
    return extractor.get_text()


def extract_title(html_bytes, encoding='utf-8'):
    """Extract <title> from HTML."""
    try:
        html_str = html_bytes.decode(encoding, errors='replace')
    except:
        html_str = html_bytes.decode('latin-1', errors='replace')

    extractor = HTMLTitleExtractor()
    try:
        extractor.feed(html_str)
    except:
        pass
    return extractor.title.strip()


def get_encoding(content_type):
    """Parse encoding from Content-Type header."""
    if 'charset=' in content_type:
        return content_type.split('charset=')[-1].strip().split(';')[0]
    return 'utf-8'


def discover_links(url, html_bytes, encoding='utf-8'):
    """Extract all doc links from an HTML page."""
    try:
        html_str = html_bytes.decode(encoding, errors='replace')
    except:
        html_str = html_bytes.decode('latin-1', errors='replace')

    extractor = LinkExtractor(url)
    try:
        extractor.feed(html_str)
    except:
        pass
    return extractor.links


def url_to_filepath(url):
    """Convert a URL to a local filepath."""
    path = url.replace(BASE_URL, '')
    # Remove query string
    path = path.split('?')[0]
    if not path or path.endswith('/'):
        path += 'index.html'
    return OUT_DIR / path


def is_doc_url(url):
    """Check if a URL is a documentation page we want to fetch."""
    if not url.startswith(BASE_URL):
        return False
    path = url.replace(BASE_URL, '')
    # Skip PDFs and large binary files for text extraction
    # (we still save HTML/XHTML/TXT)
    ext = path.rsplit('.', 1)[-1].lower() if '.' in path else ''
    return ext in ('html', 'xhtml', 'htm', 'txt', '')


def save_file(filepath, content):
    """Save content to a file."""
    filepath.parent.mkdir(parents=True, exist_ok=True)
    filepath.write_bytes(content)


def normalize_url(base_url, href):
    """Resolve a relative URL against a base."""
    if href.startswith('http'):
        return href
    # Handle relative paths
    if href.startswith('/'):
        # Absolute path
        from urllib.parse import urlparse
        parsed = urlparse(base_url)
        return f"{parsed.scheme}://{parsed.netloc}{href}"
    # Relative path
    base = base_url.rsplit('/', 1)[0] + '/'
    # Handle ../ paths
    while href.startswith('../'):
        href = href[3:]
        base = base.rsplit('/', 2)[0] + '/'
    return base + href


def infer_formats_from_path(path):
    ext = Path(path).suffix.lower().lstrip('.')
    return [ext] if ext else ['html']


def build_catalog_tree(entries):
    root = {
        'schema_version': 1,
        'type': 'catalog',
        'title': 'Fetched Documentation Catalog',
        'roots': [],
    }

    groups = {}

    def get_group(parent_children, group_id, title, path_key):
        if path_key in groups:
            return groups[path_key]
        group = {
            'type': 'group',
            'id': group_id,
            'title': title,
            'description': '',
            'children': [],
        }
        parent_children.append(group)
        groups[path_key] = group
        return group

    for entry in sorted(entries, key=lambda item: item['path']):
        parts = Path(entry['path']).parts
        parent_children = root['roots']
        parent_path = []

        for segment in parts[:-1]:
            parent_path.append(segment)
            group_path = '/'.join(parent_path)
            group = get_group(
                parent_children,
                f"group:{group_path.replace('/', ':')}",
                segment,
                group_path,
            )
            parent_children = group['children']

        parent_children.append({
            'type': 'document',
            'id': f"doc:{entry['path'].replace('/', ':')}",
            'title': entry['title'],
            'href': entry['path'],
            'formats': infer_formats_from_path(entry['path']),
            'tags': [],
            'path': entry['path'],
            'url': entry['url'],
            'meta': {
                'source_path': entry['path'],
            },
        })

    return root


def main():
    print("=" * 60)
    print("X.Org Documentation Fetcher")
    print("=" * 60)
    print(f"Base URL: {BASE_URL}")
    print(f"Output:   {OUT_DIR}")
    print()

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # Phase 1: Discover all URLs from the main index
    print("[1/4] Fetching main index...")
    content, ctype = fetch_url(BASE_URL)
    if not content:
        print("ERROR: Could not fetch main index!")
        return

    encoding = get_encoding(ctype)
    links = discover_links(BASE_URL, content, encoding)
    print(f"  Found {len(links)} links on main index")

    # Resolve all links to absolute URLs
    all_urls = set()
    for link in links:
        url = normalize_url(BASE_URL, link)
        if is_doc_url(url):
            all_urls.add(url)

    # Also add man page index pages
    man_sections = ['man1', 'man3', 'man4', 'man5', 'man7']
    for section in man_sections:
        idx_url = BASE_URL + f'man/{section}/index.xhtml'
        all_urls.add(idx_url)

    print(f"  Resolved to {len(all_urls)} fetchable doc URLs")

    # Phase 2: Fetch man page indices to discover individual man pages
    print("\n[2/4] Discovering man pages...")
    man_page_urls = set()
    for section in man_sections:
        idx_url = BASE_URL + f'man/{section}/index.xhtml'
        content, ctype = fetch_url(idx_url)
        if content:
            encoding = get_encoding(ctype)
            links = discover_links(idx_url, content, encoding)
            for link in links:
                url = normalize_url(idx_url, link)
                if url.endswith('.xhtml') and 'x.org/releases/current/doc' in url:
                    man_page_urls.add(url)
            print(f"  {section}: {len(links)} man pages found")
        time.sleep(REQUEST_DELAY)

    all_urls.update(man_page_urls)
    print(f"  Total URLs to fetch: {len(all_urls)}")

    # Phase 3: Fetch all docs
    print(f"\n[3/4] Fetching {len(all_urls)} documents...")
    docs = []  # (url, filepath, title, text_content)
    fetched = 0
    failed = 0

    def fetch_and_process(url):
        time.sleep(REQUEST_DELAY)
        content, ctype = fetch_url(url)
        if not content:
            return None

        filepath = url_to_filepath(url)
        save_file(filepath, content)

        encoding = get_encoding(ctype)
        title = extract_title(content, encoding)
        text = extract_text(content, encoding)

        rel_path = str(filepath.relative_to(OUT_DIR))
        return {
            'url': url,
            'path': rel_path,
            'title': title or rel_path,
            'text': text,
        }

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(fetch_and_process, url): url for url in sorted(all_urls)}
        for future in as_completed(futures):
            url = futures[future]
            try:
                result = future.result()
                if result:
                    docs.append(result)
                    fetched += 1
                else:
                    failed += 1
            except Exception as e:
                print(f"  ERROR processing {url}: {e}")
                failed += 1

            total = fetched + failed
            if total % 50 == 0:
                print(f"  Progress: {total}/{len(all_urls)} ({fetched} ok, {failed} failed)")

    print(f"\n  Fetched: {fetched}")
    print(f"  Failed:  {failed}")

    # Phase 4: Build search index
    print(f"\n[4/4] Building search index...")

    # Create a search-friendly index
    search_entries = []
    for doc in docs:
        # Truncate very long texts for the search index
        text = doc['text']
        if len(text) > 50000:
            text = text[:50000]

        search_entries.append({
            'path': doc['path'],
            'title': doc['title'],
            'text': text,
            'url': doc['url'],
        })

    # Sort by path for consistency
    search_entries.sort(key=lambda x: x['path'])

    # Write the search index as a JS file for the current app
    js_content = 'const SEARCH_DOCS = ' + json.dumps(search_entries, ensure_ascii=False) + ';\n'
    INDEX_FILE.write_text(js_content, encoding='utf-8')

    # Also write data-only artifacts for the generalized document browser
    SEARCH_JSON_FILE.write_text(json.dumps(search_entries, ensure_ascii=False), encoding='utf-8')
    CATALOG_FILE.write_text(json.dumps(build_catalog_tree(search_entries), indent=2, ensure_ascii=False), encoding='utf-8')

    print(f"  Index file: {INDEX_FILE}")
    print(f"  Search JSON: {SEARCH_JSON_FILE}")
    print(f"  Catalog file: {CATALOG_FILE}")
    print(f"  Index entries: {len(search_entries)}")
    index_size_mb = INDEX_FILE.stat().st_size / 1024 / 1024
    print(f"  Index size: {index_size_mb:.1f} MB")

    # Also write a manifest of all docs
    manifest = {
        'schema_version': 1,
        'fetched_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        'base_url': BASE_URL,
        'total_docs': len(search_entries),
        'total_size_bytes': sum(len(d['text'].encode('utf-8')) for d in search_entries),
        'search_index_js': INDEX_FILE.name,
        'search_index_json': SEARCH_JSON_FILE.name,
        'catalog_file': CATALOG_FILE.name,
    }
    manifest_file = OUT_DIR / 'manifest.json'
    manifest_file.write_text(json.dumps(manifest, indent=2), encoding='utf-8')

    print(f"\n{'='*60}")
    print(f"Done! {len(search_entries)} documents fetched and indexed.")
    print(f"Run: python3 -m http.server 8080")
    print(f"Open: http://localhost:8080")
    print(f"{'='*60}")


if __name__ == '__main__':
    main()
