import { supabase } from '../lib/supabase';

export interface Photo {
  id: string;
  url: string;
  title: string;
  description?: string;
  createdAt: string;
  projectId?: string;
  name: string;
  date: string;
  tags: string[];
  flagged: boolean;
  flagReason?: string;
  progress?: number;
  dateTaken: string;
}

// Function to fetch photos from Supabase
export const getPhotos = async (): Promise<Photo[]> => {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching photos: ${error.message}`);
  }

  return data || [];
};

// Function to fetch a single photo by ID
export const getPhotoById = async (id: string): Promise<Photo | null> => {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching photo: ${error.message}`);
  }

  return data;
};

// Function to upload a photo
export const uploadPhoto = async (formData: FormData): Promise<Photo> => {
  const file = formData.get('image') as File;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const projectId = formData.get('projectId') as string;

  // Upload image to Supabase Storage
  const fileName = `${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('photos')
    .upload(fileName, file);

  if (uploadError) {
    throw new Error(`Error uploading photo: ${uploadError.message}`);
  }

  // Get the public URL for the uploaded file
  const { data: { publicUrl } } = supabase.storage
    .from('photos')
    .getPublicUrl(fileName);

  // Create photo record in the database
  const { data, error } = await supabase
    .from('photos')
    .insert([
      {
        title,
        description,
        url: publicUrl,
        projectId,
        name: title,
        date: new Date().toISOString().split('T')[0],
        tags: [],
        flagged: false,
        dateTaken: new Date().toISOString()
      }
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating photo record: ${error.message}`);
  }

  return data;
};

// Function to update a photo
export const updatePhoto = async (id: string, updates: Partial<Photo>): Promise<Photo> => {
  const { data, error } = await supabase
    .from('photos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating photo: ${error.message}`);
  }

  return data;
};

// Function to delete a photo
export const deletePhoto = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting photo: ${error.message}`);
  }
}; 