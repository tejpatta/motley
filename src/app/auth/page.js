'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAvailability = async () => {
      if (username.length >= 3) {
        const isAvailable = await checkUsernameAvailability(username);
        setIsUsernameAvailable(isAvailable);
      } else {
        setIsUsernameAvailable(null);
      }
    };

    const debounce = setTimeout(checkAvailability, 500);
    return () => clearTimeout(debounce);
  }, [username]);

  const checkUsernameAvailability = async (username) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking username:', error);
      return false;
    }

    return !data;
  };

  const signUp = async () => {
    // Username validation
    if (!username.trim()) {
      alert('Username is required');
      return;
    }

    if (username.length < 3 || username.length > 20) {
      alert('Username must be between 3 and 20 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      alert('Username can only contain letters, numbers, and underscores');
      return;
    }

    if (!isUsernameAvailable) {
      alert('This username is already taken');
      return;
    }

    // Email validation
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    // Proceed with sign up
    const { data: authData, error: authError } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          username: username,
        }
      }
    });

    if (authError) {
      alert(authError.message);
      return;
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ 
        id: authData.user.id, 
        username: username, 
        email: email 
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      alert('Error creating profile. Please try again.');
      return;
    }

    alert('Check your email for the confirmation link');
    setIsSignUp(false);
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else {
      alert('Logged in successfully');
      router.push('/dashboard');
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      console.log('Error signing in with Google:', error.message);
      alert('Error signing in with Google');
    }
  };

  return (
    <div>
      {isSignUp && (
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          {username.length >= 3 && (
            <span style={{ color: isUsernameAvailable ? 'green' : 'red' }}>
              {isUsernameAvailable ? 'Username is available' : 'Username is taken'}
            </span>
          )}
        </div>
      )}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {isSignUp ? (
        <button onClick={signUp}>Sign Up</button>
      ) : (
        <>
          <button onClick={signIn}>Sign In</button>
          <button onClick={() => setIsSignUp(true)}>Create Account</button>
        </>
      )}
      <button onClick={signInWithGoogle}>Sign In with Google</button>
    </div>
  );
}