'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import crypto from 'crypto';
import PodcastPlayer from './PodcastPlayer';

const MAX_FEEDS = 5;
//const MAX_EPISODES_PER_FEED = 100;
const EPISODES_PER_PAGE = 15;

export default function SearchPodcasts() {
  const [query, setQuery] = useState('');
  const [allResults, setAllResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalPages = Math.ceil(allResults.length / EPISODES_PER_PAGE);
  const paginatedResults = allResults.slice(
    (currentPage - 1) * EPISODES_PER_PAGE,
    currentPage * EPISODES_PER_PAGE
  );

  const searchPodcasts = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setAllResults([]);
    setCurrentPage(1);

    try {
      const feeds = await searchFeeds(query);
      let allEpisodes = [];
      for (const feed of feeds.slice(0, MAX_FEEDS)) {
        const episodes = await fetchEpisodesByFeedId(feed.id);
        allEpisodes = [...allEpisodes, ...episodes];
      }
      const filteredEpisodes = filterEpisodesByTitle(allEpisodes, query);
      setAllResults(filteredEpisodes);
    } catch (error) {
      console.error('Error fetching episodes:', error);
      setError('Failed to fetch episodes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Podcast Episodes by Title"
      />
      <button onClick={searchPodcasts} disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
      
      {error && <p className="error">{error}</p>}
      
      {paginatedResults.length > 0 ? (
        <>
          <ul>
            {paginatedResults.map((result) => (
              <li key={result.id}>
                <h3>{result.title}</h3>
                <p>Podcast: {result.feedTitle}</p>
                <p>{result.description}</p>
                {result.enclosureUrl && (
                  <PodcastPlayer url={result.enclosureUrl} />
                )}
              </li>
            ))}
          </ul>
          <div className="pagination">
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        !isLoading && <p>No episodes found. Try a different search term.</p>
      )}
    </div>
  );
}

const getAuthHeaders = () => {
  const apiKey = process.env.NEXT_PUBLIC_PODCAST_INDEX_KEY;
  const apiSecret = process.env.NEXT_PUBLIC_PODCAST_INDEX_SECRET;
  const apiHeaderTime = Math.floor(Date.now() / 1000);
  
  const hash = crypto.createHash('sha1')
    .update(apiKey + apiSecret + apiHeaderTime)
    .digest('hex');

  return {
    'X-Auth-Date': apiHeaderTime,
    'X-Auth-Key': apiKey,
    'Authorization': hash,
    'User-Agent': 'Motley/1.0',
  };
};

const searchFeeds = async (query) => {
  const response = await axios.get('https://api.podcastindex.org/api/1.0/search/byterm', {
    params: { q: query, max: MAX_FEEDS },
    headers: getAuthHeaders(),
  });
  return response.data.feeds || [];
};

const fetchEpisodesByFeedId = async (feedId) => {
  const response = await axios.get('https://api.podcastindex.org/api/1.0/episodes/byfeedid', {
    params: { id: feedId, max: MAX_EPISODES_PER_FEED },
    headers: getAuthHeaders(),
  });
  return response.data.items || [];
};

const filterEpisodesByTitle = (episodes, query) => {
  return episodes.filter(episode => 
    episode.title.toLowerCase().includes(query.toLowerCase())
  );
};