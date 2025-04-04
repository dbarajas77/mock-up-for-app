import { createReducer } from '@reduxjs/toolkit';
import { Project } from '../../types';
import * as actions from '../actions/projects';

interface ProjectState {
  items: Project[];
  loading: boolean;
  error: string | null;
  selectedProject: Project | null;
}

const initialState: ProjectState = {
  items: [],
  loading: false,
  error: null,
  selectedProject: null
};

export const projectReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(actions.getProjects, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase('projects/getProjectsSuccess', (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    })
    .addCase('projects/getProjectsFailure', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(actions.getProjectDetails, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase('projects/getProjectDetailsSuccess', (state, action) => {
      state.selectedProject = action.payload;
      state.loading = false;
      state.error = null;
    })
    .addCase('projects/getProjectDetailsFailure', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
}); 