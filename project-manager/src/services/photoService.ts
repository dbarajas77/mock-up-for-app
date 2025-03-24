import { supabase } from '../lib/supabase';

// Photo service using only mock data

export interface Photo {
  id: string;
  url: string;
  title?: string;
  description?: string;
  created_at?: string;
  project_id?: string;
  progress?: number;
  name?: string;
  date?: string;
  tags?: string[];
  flagged?: boolean;
  flag_reason?: string;
  date_taken?: string;
  notes?: Array<{
    id: string;
    text: string;
    timestamp: string;
  }>;
}

// Function to fetch photos from Supabase
export const getPhotos = async (): Promise<Photo[]> => {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching photos:', error);
    throw error;
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
    console.error('Error fetching photo:', error);
    throw error;
  }

  return data;
};

// Function to upload a photo
export const uploadPhoto = async (photo: FormData): Promise<Photo> => {
  const file = photo.get('file') as File;
  if (!file) throw new Error('No file provided');

  // Upload file to Supabase Storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `photos/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw uploadError;
  }

  // Get public URL for the uploaded file
  const { data: { publicUrl } } = supabase.storage
    .from('photos')
    .getPublicUrl(filePath);

  // Create photo record in the database
  const photoData = {
    url: publicUrl,
    title: photo.get('title') as string,
    description: photo.get('description') as string || null,
    name: file.name,
    date: new Date().toISOString(),
    tags: photo.get('tags') ? JSON.parse(photo.get('tags') as string) : [],
    flagged: false,
    date_taken: photo.get('date_taken') as string || new Date().toISOString()
  };

  // Only add project_id if it exists and is not empty
  const projectId = photo.get('project_id') as string;
  if (projectId && projectId.trim()) {
    photoData['project_id'] = projectId;
  }

  const { data, error } = await supabase
    .from('photos')
    .insert([photoData])
    .select()
    .single();

  if (error) {
    console.error('Error creating photo record:', error);
    // Clean up the uploaded file if database insert fails
    await supabase.storage.from('photos').remove([filePath]);
    throw error;
  }

  return data;
};

// Function to delete a photo
export const deletePhoto = async (id: string): Promise<void> => {
  // First get the photo to get its URL
  const { data: photo, error: fetchError } = await supabase
    .from('photos')
    .select('url')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching photo for deletion:', fetchError);
    throw fetchError;
  }

  if (photo) {
    // Extract the file path from the URL
    const url = new URL(photo.url);
    const filePath = url.pathname.split('/').pop();
    
    if (filePath) {
      // Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('photos')
        .remove([`photos/${filePath}`]);

      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
        throw storageError;
      }
    }
  }

  // Delete the database record
  const { error: deleteError } = await supabase
    .from('photos')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('Error deleting photo record:', deleteError);
    throw deleteError;
  }
};

// Mock data function
export const getMockPhotos = (): Photo[] => {
  return [
    { 
      id: 'p001', 
      url: 'https://images.unsplash.com/photo-1590274853856-f724df78f8dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80',
      title: 'Boston Harbor Construction',
      description: 'Aerial view of the Boston Harbor renovation project',
      created_at: '2025-01-15T09:30:00Z',
      project_id: 'p001',
      name: 'Boston Harbor',
      date: '2025-01-15',
      tags: ['Construction', 'Aerial', 'Harbor'],
      flagged: true,
      flag_reason: 'Needs immediate attention - safety concerns',
      progress: 0.75,
      date_taken: '2025-01-15T09:30:00Z'
    },
    { 
      id: 'p002', 
      url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
      title: 'Cambridge Tech Campus',
      description: 'Foundation work for the new Cambridge Tech Campus',
      created_at: '2025-01-20T14:15:00Z',
      project_id: 'p002',
      name: 'Tech Campus',
      date: '2025-01-20',
      tags: ['Foundation', 'Campus', 'Tech'],
      flagged: false,
      progress: 0.25,
      date_taken: '2025-01-20T14:15:00Z'
    },
    { 
      id: 'p003', 
      url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2531&q=80',
      title: 'Downtown Office Tower',
      description: 'Progress on the downtown office tower project',
      created_at: '2025-01-25T11:45:00Z',
      project_id: 'p003',
      name: 'Office Tower',
      date: '2025-01-25',
      tags: ['Office', 'Downtown', 'Tower'],
      flagged: true,
      flag_reason: 'Schedule delay - need to follow up',
      progress: 0.5,
      date_taken: '2025-01-25T11:45:00Z'
    },
    { 
      id: 'p004', 
      url: 'https://images.unsplash.com/photo-1626885930974-4b69aa21bbf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80',
      title: 'Riverside Apartments',
      description: 'Exterior finishing on the riverside apartment complex',
      created_at: '2025-02-05T16:20:00Z',
      project_id: 'p004',
      name: 'Riverside Apts',
      date: '2025-02-05',
      tags: ['Apartment', 'Riverside', 'Exterior'],
      flagged: false,
      progress: 0.6,
      date_taken: '2025-02-05T16:20:00Z'
    },
    { 
      id: 'p005', 
      url: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80',
      title: 'Hospital Wing Extension',
      description: 'Construction of the new hospital wing',
      created_at: '2025-02-10T09:10:00Z',
      project_id: 'p005',
      name: 'Hospital Wing',
      date: '2025-02-10',
      tags: ['Hospital', 'Construction', 'Medical'],
      flagged: true,
      flag_reason: 'Material quality issue',
      progress: 0.35,
      date_taken: '2025-02-10T09:10:00Z'
    },
    { 
      id: 'p006', 
      url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2669&q=80',
      title: 'School Renovation',
      description: 'Interior renovation of the main school building',
      created_at: '2025-02-15T13:30:00Z',
      project_id: 'p006',
      name: 'School Reno',
      date: '2025-02-15',
      tags: ['School', 'Renovation', 'Interior'],
      flagged: false,
      progress: 0.9,
      date_taken: '2025-02-15T13:30:00Z'
    },
    { 
      id: 'p007', 
      url: 'https://images.unsplash.com/photo-1599707254554-4b69aa21bbf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2533&q=80',
      title: 'Bridge Repair',
      description: 'Structural repairs on the main bridge',
      created_at: '2025-02-20T10:45:00Z',
      project_id: 'p007',
      name: 'Bridge Repair',
      date: '2025-02-20',
      tags: ['Bridge', 'Repair', 'Infrastructure'],
      flagged: true,
      flag_reason: 'Structural integrity concern',
      progress: 0.45,
      date_taken: '2025-02-20T10:45:00Z'
    },
    { 
      id: 'p008', 
      url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
      title: 'Solar Farm Installation',
      description: 'Installation of solar panels at the new energy farm',
      created_at: '2025-02-25T15:15:00Z',
      project_id: 'p008',
      name: 'Solar Farm',
      date: '2025-02-25',
      tags: ['Solar', 'Energy', 'Installation'],
      flagged: false,
      progress: 0.15,
      date_taken: '2025-02-25T15:15:00Z'
    }
  ];
};
