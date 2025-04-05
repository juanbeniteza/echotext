import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { TextConfig, LinkRecord } from '../types';
import { supabase } from '../lib/supabase';

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save a configuration and generate a link
  const saveConfig = useCallback(async (
    config: TextConfig,
    expiresIn?: number // Time in milliseconds until expiration
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);
    
    try {
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
        });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save configuration';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a configuration by ID
  const getConfig = useCallback(async (id: string): Promise<TextConfig | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the link record
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data) {
        return null;
      }
      
      const record = data as unknown as LinkRecord;
      
      // Check if the link has expired
      if (record.expires_at && new Date(record.expires_at) < new Date()) {
        setError('This link has expired');
        return null;
      }
      
      // Increment view count
      await supabase
        .from('links')
        .update({ view_count: record.view_count + 1 })
        .eq('id', id);
      
      return record.config;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch configuration';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    saveConfig,
    getConfig,
  };
}; 