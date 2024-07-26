'use client';

import { useParams } from 'next/navigation';
import ListManager from '../../../components/ListManager';

export default function ListPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Manage List</h1>
      <ListManager listId={id} />
    </div>
  );
}