import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Project } from '../../types';
import { projectService } from '../../services/projectService';

interface ProjectState {
  items: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  items: [],
  loading: false,
  error: null
};

// Async thunk for fetching projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async () => {
    const projects = await projectService.getAll();
    return projects;
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      });
  }
});

export default projectSlice.reducer; 