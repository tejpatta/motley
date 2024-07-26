'use client';

import { supabase } from '../lib/supabaseClient';

export default function DeleteList({ listId, onListDeleted }) {
  const deleteList = async () => {
    const { data, error } = await supabase
      .from('lists')
      .delete()
      .eq('id', listId);

    if (error) console.error('Error deleting list:', error);
    else console.log('List deleted:', data);
    if (onListDeleted) onListDeleted();
  };

  return (
    <button onClick={deleteList}>Delete List</button>
  );
}
