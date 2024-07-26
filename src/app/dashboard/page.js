'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import CreateList from '../../components/CreateList';
import DeleteList from '../../components/DeleteList';
import Link from 'next/link';

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
      <CreateList onListCreated={(newList) => setLists([newList, ...lists])} />
      <ul>
        {lists.map((list) => (
          <li key={list.id}>
            <Link href={`/list/${list.id}`}>
              {list.title}
            </Link>
            <DeleteList 
              listId={list.id} 
              onListDeleted={() => setLists(lists.filter(l => l.id !== list.id))}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}