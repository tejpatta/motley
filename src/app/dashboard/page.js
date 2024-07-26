'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import CreateList from '../../components/CreateList';
import DeleteList from '../../components/DeleteList';

export default function Dashboard() {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) console.error('Error fetching lists:', error);
      else setLists(data);
    };

    fetchLists();
  }, []);

  return (
    <div>
      <h1>Your Lists</h1>
      <CreateList />
      <ul>
        {lists.map((list) => (
          <li key={list.id}>
            {list.title}
            <DeleteList listId={list.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
