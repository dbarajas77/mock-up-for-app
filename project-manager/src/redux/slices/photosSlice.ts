import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types
interface Photo {
  id: string;
  projectId: string;
  url: string;
  caption?: string;
  createdAt: string;
  tags?: string[];
}

interface PhotosState {
  photos: Photo[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PhotosState = {
  photos: [],
  loading: false,
  error: null,
};

// Create slice
const photosSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    // Placeholder reducers for future implementation
    setPhotos: (state, action: PayloadAction<Photo[]>) => {
      state.photos = action.payload;
    },
    addPhoto: (state, action: PayloadAction<Photo>) => {
      state.photos.push(action.payload);
    },
    updatePhoto: (state, action: PayloadAction<Photo>) => {
      const index = state.photos.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.photos[index] = action.payload;
      }
    },
    deletePhoto: (state, action: PayloadAction<string>) => {
      state.photos = state.photos.filter(p => p.id !== action.payload);
    },
  },
});

// Export actions and reducer
export const { setPhotos, addPhoto, updatePhoto, deletePhoto } = photosSlice.actions;
export default photosSlice.reducer;
