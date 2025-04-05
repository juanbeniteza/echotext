import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { supabase } from '../../../../lib/supabase';
import { TextConfig } from '../../../../types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { config, expiresIn }: { config: TextConfig, expiresIn?: number } = body;
    
    if (!config || !config.text) {
      return NextResponse.json(
        { error: 'Config and text are required' },
        { status: 400 }
      );
    }
    
    // Generate a short ID (8 characters)
    const id = nanoid(8);
    
    // Calculate expiration date if provided
    const expires_at = expiresIn ? new Date(Date.now() + expiresIn) : null;
    
    // Insert into Supabase
    const { error } = await supabase
      .from('links')
      .insert({
        id,
        config,
        expires_at,
        view_count: 0,
        created_at: new Date(),
      });
    
    if (error) {
      console.error('Error creating link:', error);
      return NextResponse.json(
        { error: 'Failed to create link' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ id });
  } catch (err) {
    console.error('Error in link creation:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 