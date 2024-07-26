'use client';

import { supabase } from '../../lib/supabaseClient';

export default function DeleteList({ listId }) {
  const deleteList = async () => {
    const { data, error } = await supabase
      .from('lists')
      .delete()
      .eq('id', listId);

    if (error) console.error('Error deleting list:', error);
    else console.log('List deleted:', data);
  };

  return (
    <button onClick={deleteList}>Delete List</button>
  );
}
