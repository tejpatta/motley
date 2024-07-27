'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function CreateUsername() {
  const [username, setUsername] = useState('');
  const [isAvailable, setIsAvailable] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        router.push('/auth');
      }
    };
    getUser();
  }, [router]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (username.length >= 3) {
        const { data } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .single();
        setIsAvailable(!data);
      }
    };
    checkAvailability();
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAvailable || !user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', user.id);

    if (error) {
      alert('Error updating username');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div>
      <h1>Create Username</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          minLength={3}
          required
        />
        {username.length >= 3 && (
          <p>{isAvailable ? 'Username is available' : 'Username is taken'}</p>
        )}
        <button type="submit" disabled={!isAvailable}>
          Set Username
        </button>
      </form>
    </div>
  );
}