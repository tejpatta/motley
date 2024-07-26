'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AddMediaItem({ listId, mediaType, fields, onItemAdded }) {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addItem = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('list_items')
        .insert([
          { 
            list_id: listId, 
            item_type: mediaType,
            item_details: formData
          }
        ]);

      if (error) throw error;

      setFormData({});
      if (onItemAdded) onItemAdded(data[0]);
    } catch (error) {
      console.error(`Error adding ${mediaType}:`, error);
      setError(`Failed to add ${mediaType}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={addItem}>
      {fields.map(field => (
        <input
          key={field}
          type="text"
          name={field}
          value={formData[field] || ''}
          onChange={handleChange}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          required
        />
      ))}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : `Add ${mediaType}`}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}