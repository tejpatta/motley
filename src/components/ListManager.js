'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import SearchPodcasts from './SearchPodcasts';
import PodcastPlayer from './PodcastPlayer';

export default function ListManager({ listId }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [newItem, setNewItem] = useState({ type: 'book', title: '', author: '' });

  useEffect(() => {
    fetchListItems();
  }, [listId]);

  const fetchListItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('list_items')
        .select('*')
        .eq('list_id', listId);

      if (error) throw error;
      setItems(data);
    } catch (error) {
      console.error('Error fetching list items:', error);
      setError('Failed to fetch list items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePodcastSelect = (episode) => {
    setSelectedPodcast(episode);
  };

  const addPodcastToList = async () => {
    if (!selectedPodcast) return;

    try {
      const { data, error } = await supabase
        .from('list_items')
        .insert([
          {
            list_id: listId,
            item_type: 'podcast',
            item_details: {
              title: selectedPodcast.title,
              podcast_name: selectedPodcast.feedTitle,
              episode_url: selectedPodcast.enclosureUrl,
              description: selectedPodcast.description
            }
          }
        ]);

      if (error) throw error;

      setItems([...items, data[0]]);
      setSelectedPodcast(null);
    } catch (error) {
      console.error('Error adding podcast:', error);
      setError('Failed to add podcast. Please try again.');
    }
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const addNewItem = async () => {
    try {
      const { data, error } = await supabase
        .from('list_items')
        .insert([
          {
            list_id: listId,
            item_type: newItem.type,
            item_details: {
              title: newItem.title,
              author: newItem.author,
              // Add more fields as needed for different item types
            }
          }
        ]);

      if (error) throw error;

      setItems([...items, data[0]]);
      setNewItem({ type: 'book', title: '', author: '' });
    } catch (error) {
      console.error('Error adding new item:', error);
      setError('Failed to add new item. Please try again.');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const { error } = await supabase
        .from('list_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setItems(items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Failed to remove item. Please try again.');
    }
  };

  const renderItem = (item) => {
    switch (item.item_type) {
      case 'podcast':
        return (
          <div>
            <h3>{item.item_details.title}</h3>
            <p>Podcast: {item.item_details.podcast_name}</p>
            <PodcastPlayer url={item.item_details.episode_url} />
          </div>
        );
      case 'book':
        return (
          <div>
            <h3>{item.item_details.title}</h3>
            <p>Author: {item.item_details.author}</p>
          </div>
        );
      // Add cases for other item types here
      default:
        return <p>{JSON.stringify(item.item_details)}</p>;
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>List Items</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {renderItem(item)}
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>

      <h3>Add New Item</h3>
      <select name="type" value={newItem.type} onChange={handleNewItemChange}>
        <option value="book">Book</option>
        <option value="movie">Movie</option>
        {/* Add more options as needed */}
      </select>
      <input
        type="text"
        name="title"
        value={newItem.title}
        onChange={handleNewItemChange}
        placeholder="Title"
      />
      <input
        type="text"
        name="author"
        value={newItem.author}
        onChange={handleNewItemChange}
        placeholder="Author"
      />
      <button onClick={addNewItem}>Add Item</button>

      <h3>Add Podcast to List</h3>
      <SearchPodcasts onEpisodeSelect={handlePodcastSelect} />
      {selectedPodcast && (
        <div>
          <h4>Selected Episode: {selectedPodcast.title}</h4>
          <p>Podcast: {selectedPodcast.feedTitle}</p>
          <button onClick={addPodcastToList}>Add to List</button>
        </div>
      )}
    </div>
  );
}