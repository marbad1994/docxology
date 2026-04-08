// Search Web Worker
// Loads the full search index and performs full-text search off the main thread

let searchDocs = null;
let ready = false;

// Build a lightweight inverted index for faster search
let invertedIndex = null; // word -> [docIndex, ...]
let docTitles = null;

function buildIndex(docs) {
  invertedIndex = new Map();
  docTitles = [];

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    docTitles.push(doc.title);

    // Tokenize title and first 5000 chars of text
    const content = (doc.title + ' ' + doc.text.substring(0, 5000)).toLowerCase();
    const words = content.match(/[a-z0-9_]+/g);
    if (!words) continue;

    const seen = new Set();
    for (const word of words) {
      if (word.length < 2) continue;
      if (seen.has(word)) continue;
      seen.add(word);

      if (!invertedIndex.has(word)) {
        invertedIndex.set(word, []);
      }
      invertedIndex.get(word).push(i);
    }
  }
}

self.onmessage = function (e) {
  const { type, payload } = e.data;

  if (type === 'init') {
    // Load search index via importScripts
    try {
      importScripts('search_index.js');
      searchDocs = SEARCH_DOCS;
      buildIndex(searchDocs);
      ready = true;
      self.postMessage({ type: 'ready', payload: { count: searchDocs.length } });
    } catch (err) {
      self.postMessage({ type: 'error', payload: err.message });
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

    // Score using inverted index for each query word
    for (const qWord of queryWords) {
      // Exact word matches from inverted index
      for (const [word, docIndices] of invertedIndex) {
        if (word === qWord) {
          for (const idx of docIndices) scores[idx] += 10;
        } else if (word.startsWith(qWord)) {
          for (const idx of docIndices) scores[idx] += 5;
        }
      }
    }

    // Boost title matches significantly
    for (let i = 0; i < searchDocs.length; i++) {
      const titleLower = searchDocs[i].title.toLowerCase();
      if (titleLower.includes(query)) {
        scores[i] += 50;
        if (titleLower.startsWith(query)) scores[i] += 20;
      }
      // Also check the actual text for the full query phrase
      if (scores[i] > 0 && searchDocs[i].text.toLowerCase().includes(query)) {
        scores[i] += 5;
      }
    }

    // Collect top results
    const results = [];
    for (let i = 0; i < scores.length; i++) {
      if (scores[i] > 0) {
        results.push({ index: i, score: scores[i] });
      }
    }

    results.sort((a, b) => b.score - a.score);
    const topResults = results.slice(0, maxResults).map(r => {
      const doc = searchDocs[r.index];
      // Extract a snippet around the query match
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
        // Use first 200 chars
        snippet = doc.text.substring(0, 200).replace(/\n/g, ' ') + '...';
      }

      return {
        path: doc.path,
        title: doc.title,
        url: doc.url,
        snippet: snippet,
        score: r.score,
      };
    });

    self.postMessage({ type: 'results', payload: { query: payload.query, results: topResults } });
  }
};
