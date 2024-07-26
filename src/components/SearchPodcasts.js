'use client';

import { useState } from 'react';
import axios from 'axios';
import crypto from 'crypto';
import PodcastPlayer from './PodcastPlayer';

const MAX_FEEDS = 5;
//const MAX_EPISODES_PER_FEED = 20;
const EPISODES_PER_PAGE = 10;

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
        allEpisodes = [...allEpisodes, ...episodes.map(episode => ({...episode, feedTitle: feed.title}))];
      }
      setAllResults(allEpisodes);
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

  const handleEpisodeSelect = (episode) => {
    setSelectedEpisode(episode);
    if (onEpisodeSelect) {
      onEpisodeSelect(episode);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Podcasts"
      />
      <button onClick={searchPodcasts} disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
      
      {error && <p className="error">{error}</p>}
      
      {paginatedResults.length > 0 ? (
        <>
          <ul>
            {paginatedResults.map((episode) => (
              <li key={episode.id}>
                <h3>{episode.title}</h3>
                <p>Podcast: {episode.feedTitle}</p>
                {episode.enclosureUrl && (
                  <PodcastPlayer url={episode.enclosureUrl} />
                )}
                <button 
                  onClick={() => handleEpisodeSelect(episode)}
                  style={{backgroundColor: selectedEpisode?.id === episode.id ? 'lightblue' : 'white'}}
                >
                  {selectedEpisode?.id === episode.id ? 'Selected' : 'Select Episode'}
                </button>
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
      
      {selectedEpisode && (
        <div>
          <h3>Selected Episode:</h3>
          <p>{selectedEpisode.title}</p>
          <p>Podcast: {selectedEpisode.feedTitle}</p>
        </div>
      )}
    </div>
  );
}
