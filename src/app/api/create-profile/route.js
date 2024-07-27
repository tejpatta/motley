import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const { user } = await request.json();

  // Generate a username from the email if not provided
  let generatedUsername = user.user_metadata.username || user.email.split('@')[0];
  
  // Check username availability and modify if necessary
  let isAvailable = false;
  let counter = 1;
  while (!isAvailable) {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', generatedUsername)
      .single();

    if (!data) {
      isAvailable = true;
    } else {
      generatedUsername = `${user.email.split('@')[0]}${counter}`;
      counter++;
    }
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert({ 
      id: user.id, 
      username: generatedUsername,
      email: user.email,
      avatar_url: user.user_metadata.avatar_url
    });

  if (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json({ error: 'Error creating profile' }, { status: 400 });
  }

  return NextResponse.json({ message: 'Profile created successfully' }, { status: 200 });
}