import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types
interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
}

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
};

// Create slice
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // Placeholder reducers for future implementation
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
    },
  },
});

// Export actions and reducer
export const { setProjects, addProject, updateProject, deleteProject } = projectsSlice.actions;
export default projectsSlice.reducer;
