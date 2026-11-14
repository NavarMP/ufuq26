import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export const SUPABASE_STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'ufuq-media';

// Initialized supabase client
export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Uploads a file to Supabase Storage bucket and returns the public CDN URL
 * @param file - The browser File object
 * @param folder - Destination folder within bucket (default: 'speakers')
 * @returns Promise<string> - Public URL of the uploaded asset
 */
export async function uploadMediaToSupabase(
  file: File,
  folder: string = 'speakers'
): Promise<string> {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to your .env.local file.'
    );
  }

  // Clean filename and ensure uniqueness with timestamp and random string
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const filePath = `${folder}/${uniquePrefix}-${cleanName}`;

  const { data, error } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}
