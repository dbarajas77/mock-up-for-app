import { createAction } from '@reduxjs/toolkit';
import { Project } from '../../types';

// Basic CRUD actions
export const getProjects = createAction('projects/getProjects');
export const getProjectDetails = createAction<{ id: string }>('projects/getProjectDetails');
export const createProject = createAction<Project>('projects/createProject');
export const updateProject = createAction<Project>('projects/updateProject');
export const deleteProject = createAction<{ id: string }>('projects/deleteProject');

// Simple filtered queries
export const getProjectsByUserId = createAction<{ userId: string }>('projects/getProjectsByUserId');
export const getProjectDetailsById = createAction<{ projectId: string }>('projects/getProjectDetailsById'); 