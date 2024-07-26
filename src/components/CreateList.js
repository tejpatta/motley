'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function CreateList({ onListCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacyType, setPrivacyType] = useState('private');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const createList = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!user) {
      setError('You must be logged in to create a list');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('lists')
        .insert([{ 
          user_id: user.id, 
          title, 
          description, 
          privacy_type: privacyType 
        }])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        if (onListCreated) onListCreated(data[0]);
        setTitle('');
        setDescription('');
        setPrivacyType('private');
        alert('List created successfully');
      } else {
        throw new Error('No data returned from insert operation');
      }
    } catch (error) {
      console.error('Error creating list:', error);
      setError(error.message || 'An error occurred while creating the list');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Create a New List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="title">Title:</label>
        <input 
          id="title"
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="List Title" 
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea 
          id="description"
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="List Description" 
        />
      </div>
      <div>
        <label htmlFor="privacyType">Privacy:</label>
        <select 
          id="privacyType"
          value={privacyType} 
          onChange={(e) => setPrivacyType(e.target.value)}
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
      </div>
      <button 
        onClick={createList} 
        disabled={isLoading || !user}
      >
        {isLoading ? 'Creating...' : 'Create List'}
      </button>
    </div>
  );
}