'use client';

import { useState } from 'react';
import axios from 'axios';

export default function SearchPodcasts() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchPodcasts = async () => {
    const response = await axios.get('https://api.podcastindex.org/api/1.0/search/byterm', {
      params: { q: query },
      headers: {
        'X-Auth-Date': Math.floor(Date.now() / 1000),
        'X-Auth-Key': process.env.NEXT_PUBLIC_PODCAST_INDEX_KEY,
        'X-Auth-Key-Id': process.env.NEXT_PUBLIC_PODCAST_INDEX_KEY_ID,
        'User-Agent': 'Motley/1.0',
      },
    });
    setResults(response.data.feeds);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Podcasts"
      />
      <button onClick={searchPodcasts}>Search</button>
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
