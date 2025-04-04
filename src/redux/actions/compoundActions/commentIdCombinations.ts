import { createAction } from '@reduxjs/toolkit';
import { Project, User, Task, Comment, File } from '../../../types';

export const getProjectDetailsByCommentIdAndFileId = createAction<{
  commentId: string;
  fileId: string;
  project: Project;
}>('project/getProjectDetailsByCommentIdAndFileId');

export const getCommentDetailsByUserIdAndCommentIdAndTaskId = createAction<{
  userId: string;
  commentId: string;
  taskId: string;
  comment: Comment;
}>('comment/getCommentDetailsByUserIdAndCommentIdAndTaskId');

export const getFileDetailsByUserIdAndCommentIdAndTaskId = createAction<{
  userId: string;
  commentId: string;
  taskId: string;
  file: File;
}>('file/getFileDetailsByUserIdAndCommentIdAndTaskId');

export const getProjectDetailsByUserIdAndCommentIdAndFileId = createAction<{
  userId: string;
  commentId: string;
  fileId: string;
  project: Project;
}>('project/getProjectDetailsByUserIdAndCommentIdAndFileId');

export const getUserDetailsByUserIdAndCommentIdAndFileId = createAction<{
  userId: string;
  commentId: string;
  fileId: string;
  user: User;
}>('user/getUserDetailsByUserIdAndCommentIdAndFileId');

export const getTaskDetailsByUserIdAndCommentIdAndFileId = createAction<{
  userId: string;
  commentId: string;
  fileId: string;
  task: Task;
}>('task/getTaskDetailsByUserIdAndCommentIdAndFileId');

export const getCommentDetailsByUserIdAndCommentIdAndFileId = createAction<{
  userId: string;
  commentId: string;
  fileId: string;
  comment: Comment;
}>('comment/getCommentDetailsByUserIdAndCommentIdAndFileId'); 