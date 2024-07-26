import AddMediaItem from './AddMediaItem';

export default function AddMovie({ listId, onMovieAdded }) {
  return (
    <AddMediaItem 
      listId={listId} 
      mediaType="movie" 
      fields={['title', 'director', 'year', 'country']} 
      onItemAdded={onMovieAdded} 
    />
  );
}