import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { LinkRecord } from '../../../../types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Link ID is required' },
        { status: 400 }
      );
    }
    
    // Get the link record
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching link:', error);
      return NextResponse.json(
        { error: 'Failed to fetch link' },
        { status: 500 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }
    
    // Convert data to LinkRecord - our mock implementation might
    // have a different structure than the Supabase response
    const record: LinkRecord = {
      id: data.id,
      config: data.config,
      created_at: data.created_at instanceof Date ? data.created_at : new Date(data.created_at),
      expires_at: data.expires_at ? (data.expires_at instanceof Date ? data.expires_at : new Date(data.expires_at)) : null,
      view_count: data.view_count || 0,
      user_id: data.user_id || null
    };
    
    // Check if the link has expired
    if (record.expires_at && record.expires_at < new Date()) {
      return NextResponse.json(
        { error: 'This link has expired' },
        { status: 410 }  // Gone status code
      );
    }
    
    // Increment view count
    await supabase
      .from('links')
      .update({ view_count: record.view_count + 1 })
      .eq('id', id);
    
    return NextResponse.json({ config: record.config });
  } catch (err) {
    console.error('Error in link retrieval:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 