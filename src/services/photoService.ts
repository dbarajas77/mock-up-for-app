import { supabase } from '../lib/supabase';

export interface Photo {
  id: string;
  url: string;
  title: string;
  description?: string;
  project_id?: string;
  name: string;
  date: string;
  tags: string[];
  progress?: number;
  date_taken: string;
  created_at?: string;
  updated_at?: string;
  tasks?: string;  // JSON string: []
  notes?: string;  // JSON string: []
  drawings?: string;  // JSON string: {"lines": [], "circles": []}
}

// Function to fetch photos from Supabase
export const getPhotos = async (projectId?: string): Promise<Photo[]> => {
  console.log(`📸 Fetching photos${projectId ? ' for project: ' + projectId : ''}...`);
  let query = supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false });

  // Filter by project_id if provided
  if (projectId) {
    console.log(`📸 Applying filter for project_id: ${projectId}`);
    
    // Check if the projectId is a valid UUID
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);
    
    if (!isValidUUID) {
      console.error(`❌ Invalid project ID format: ${projectId}`);
      // Return empty array if invalid format to prevent DB errors
      return [];
    }
    
    // Use the proper filter
    query = query.eq('project_id', projectId);
  } else {
    console.log('⚠️ No projectId provided, returning all photos');
  }

  const { data, error } = await query;

  if (error) {
    console.error('❌ Error fetching photos:', error);
    throw new Error(`Error fetching photos: ${error.message}`);
  }

  console.log(`✅ Fetched ${data?.length || 0} photos.`);
  if (data && data.length > 0) {
    console.log('First photo:', JSON.stringify(data[0]));
  } else {
    console.log('No photos found for the given filter');
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
  // Get the file from formData
  const file = formData.get('file') as File;
  if (!file) {
    throw new Error('No file provided');
  }

  const title = formData.get('title') as string || file.name;
  const description = formData.get('description') as string || '';
  const projectId = formData.get('projectId') as string | undefined; // Get projectId

  // Ensure projectId is provided before uploading
  if (!projectId) {
    console.error('❌ Upload failed: projectId is required');
    throw new Error('Project ID is required to upload a photo.');
  }

  try {
    console.log('📸 Uploading photo:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      projectId: projectId // Log projectId
    });

    // Upload image to Supabase Storage
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    // Define the path within the bucket, including the project ID
    const filePath = `${projectId}/${fileName}`;
    console.log(`⬆️ Uploading to path: ${filePath}`);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('photos') // Use the 'photos' bucket
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Error uploading to storage:', uploadError);
      throw new Error(`Error uploading photo: ${uploadError.message}`);
    }

    console.log('✅ File uploaded successfully:', filePath);

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('photos') // Use the 'photos' bucket
      .getPublicUrl(filePath);

    console.log('📍 Public URL generated:', publicUrl);

    // Create photo record in the database
    const { data, error } = await supabase
      .from('photos')
      .insert([
        {
          title,
          description,
          url: publicUrl,
          project_id: projectId, // Ensure projectId is saved
          name: title, // Keep name consistent with title
          date: new Date().toISOString().split('T')[0],
          tags: [],
          progress: 0,
          date_taken: new Date().toISOString(),
          tasks: '[]',
          notes: '[]',
          drawings: '{"lines":[],"circles":[]}'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating database record:', error);
      throw new Error(`Error creating photo record: ${error.message}`);
    }

    console.log('✅ Database record created successfully for project:', projectId);
    return data;
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
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
