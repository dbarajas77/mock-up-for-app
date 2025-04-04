import { createAction } from '@reduxjs/toolkit';
import { Project } from '../../../types';

export const getProjectDetailsByTaskIdAndCommentId = createAction<{
  taskId: string;
  commentId: string;
  project: Project;
}>('project/getProjectDetailsByTaskIdAndCommentId');

export const getProjectDetailsByTaskIdAndFileId = createAction<{
  taskId: string;
  fileId: string;
  project: Project;
}>('project/getProjectDetailsByTaskIdAndFileId'); 