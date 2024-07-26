'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AddBook({ listId, onBookAdded }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addBook = async (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('list_items')
        .insert([
          { 
            list_id: listId, 
            item_type: 'book',
            item_details: { title, author }
          }
        ]);

      if (error) throw error;

      setTitle('');
      setAuthor('');
      if (onBookAdded) onBookAdded(data[0]);
    } catch (error) {
      console.error('Error adding book:', error);
      setError('Failed to add book. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={addBook}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Book Title"
        required
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Author"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Book'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}