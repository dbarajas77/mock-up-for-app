import { createAction } from '@reduxjs/toolkit';
import { Project, Task, Comment, File } from '../../../types';

export const getProjectDetailsByProjectIdAndTaskId = createAction<{
  projectId: string;
  taskId: string;
  project: Project;
}>('project/getProjectDetailsByProjectIdAndTaskId');

export const getProjectDetailsByProjectIdAndCommentId = createAction<{
  projectId: string;
  commentId: string;
  project: Project;
}>('project/getProjectDetailsByProjectIdAndCommentId');

export const getProjectDetailsByProjectIdAndFileId = createAction<{
  projectId: string;
  fileId: string;
  project: Project;
}>('project/getProjectDetailsByProjectIdAndFileId'); 