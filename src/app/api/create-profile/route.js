import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const { user } = await request.json();

  const { data, error } = await supabase
    .from('profiles')
    .insert({ 
      id: user.id, 
      email: user.email,
      avatar_url: user.user_metadata.avatar_url
    });

  if (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json({ error: 'Error creating profile' }, { status: 400 });
  }

  return NextResponse.json({ message: 'Profile created successfully' }, { status: 200 });
}