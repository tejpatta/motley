'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';


export default function CreateList() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacyType, setPrivacyType] = useState('private');

  const createList = async () => {
    const user = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('lists')
      .insert([{ user_id: user.id, title, description, privacy_type: privacyType }]);
    
    if (error) alert('Error creating list');
    else alert('List created successfully');
  };

  return (
    <div>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="List Title" 
      />
      <textarea 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="List Description" 
      />
      <select 
        value={privacyType} 
        onChange={(e) => setPrivacyType(e.target.value)}
      >
        <option value="private">Private</option>
        <option value="public">Public</option>
      </select>
      <button onClick={createList}>Create List</button>
    </div>
  );
}