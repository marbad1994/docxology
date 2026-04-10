// Search Web Worker
// Loads the full search index and performs full-text search off the main thread

let searchDocs = [];
let ready = false;

// Build a lightweight inverted index for faster search
let invertedIndex = null; // word -> [docIndex, ...]

function normalizeSearchDoc(doc, index) {
  const safeDoc = doc && typeof doc === 'object' ? doc : {};
  const path = typeof safeDoc.path === 'string' && safeDoc.path ? safeDoc.path : `generated/${index}.txt`;
  const title = typeof safeDoc.title === 'string' && safeDoc.title ? safeDoc.title : path.split('/').pop();
  return {
    path,
    title,
    text: typeof safeDoc.text === 'string' ? safeDoc.text : '',
    url: typeof safeDoc.url === 'string' ? safeDoc.url : '',
  };
}

function buildIndex(docs) {
  invertedIndex = new Map();

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const content = (doc.title + ' ' + doc.text.substring(0, 5000)).toLowerCase();
    const words = content.match(/[a-z0-9_]+/g);
    if (!words) continue;

    const seen = new Set();
    for (const word of words) {
      if (word.length < 2 || seen.has(word)) continue;
      seen.add(word);

      if (!invertedIndex.has(word)) invertedIndex.set(word, []);
      invertedIndex.get(word).push(i);
    }
  }
}

self.onmessage = function (e) {
  const { type, payload } = e.data;

  if (type === 'init') {
    try {
      importScripts('search_index.js');
      const docs = typeof SEARCH_DOCS !== 'undefined' && Array.isArray(SEARCH_DOCS) ? SEARCH_DOCS : [];
      searchDocs = docs.map(normalizeSearchDoc);
      buildIndex(searchDocs);
      ready = true;
      self.postMessage({ type: 'ready', payload: { count: searchDocs.length } });
    } catch (err) {
      self.postMessage({ type: 'error', payload: err && err.message ? err.message : 'Unknown search error' });
    }
  }

  if (type === 'search' && ready) {
    const query = payload.query.toLowerCase().trim();
    const maxResults = payload.maxResults || 50;

    if (!query) {
      self.postMessage({ type: 'results', payload: { query: payload.query, results: [] } });
      return;
    }

    const queryWords = query.match(/[a-z0-9_]+/g) || [query];
    const scores = new Float32Array(searchDocs.length);

    for (const qWord of queryWords) {
      for (const [word, docIndices] of invertedIndex) {
        if (word === qWord) {
          for (const idx of docIndices) scores[idx] += 10;
        } else if (word.startsWith(qWord)) {
          for (const idx of docIndices) scores[idx] += 5;
        }
      }
    }

    for (let i = 0; i < searchDocs.length; i++) {
      const titleLower = searchDocs[i].title.toLowerCase();
      if (titleLower.includes(query)) {
        scores[i] += 50;
        if (titleLower.startsWith(query)) scores[i] += 20;
      }
      if (scores[i] > 0 && searchDocs[i].text.toLowerCase().includes(query)) {
        scores[i] += 5;
      }
    }

    const results = [];
    for (let i = 0; i < scores.length; i++) {
      if (scores[i] > 0) results.push({ index: i, score: scores[i] });
    }

    results.sort((a, b) => b.score - a.score);
    const topResults = results.slice(0, maxResults).map(r => {
      const doc = searchDocs[r.index];
      let snippet = '';
      const textLower = doc.text.toLowerCase();
      const matchPos = textLower.indexOf(query);
      if (matchPos >= 0) {
        const start = Math.max(0, matchPos - 80);
        const end = Math.min(doc.text.length, matchPos + query.length + 120);
        snippet = (start > 0 ? '...' : '') +
          doc.text.substring(start, end).replace(/\n/g, ' ') +
          (end < doc.text.length ? '...' : '');
      } else {
        snippet = doc.text.substring(0, 200).replace(/\n/g, ' ');
        if (snippet && snippet.length === 200 && doc.text.length > 200) snippet += '...';
      }

      return {
        path: doc.path,
        title: doc.title,
        url: doc.url,
        snippet,
        score: r.score,
      };
    });

    self.postMessage({ type: 'results', payload: { query: payload.query, results: topResults } });
  }
};
