// Base actions
export {
  getProjects,
  getUsers,
  getTasks,
  getComments,
  getFiles
} from './projects';

// Details actions
export {
  getProjectDetails,
  getUserDetails,
  getTaskDetails,
  getCommentDetails,
  getFileDetails,
  getProjectDetailsById,
  getUserDetailsById,
  getTaskDetailsById,
  getCommentDetailsById,
  getFileDetailsById
} from './details';

// User ID based queries
export {
  getProjectDetailsByUserId,
  getUserDetailsByUserId,
  getTaskDetailsByUserId,
  getCommentDetailsByUserId,
  getFileDetailsByUserId
} from './byUserId';

// Project ID based queries
export {
  getProjectDetailsByProjectId,
  getUserDetailsByProjectId,
  getTaskDetailsByProjectId,
  getCommentDetailsByProjectId,
  getFileDetailsByProjectId
} from './byProjectId';

// Task ID based queries
export {
  getProjectDetailsByTaskId,
  getUserDetailsByTaskId,
  getTaskDetailsByTaskId,
  getCommentDetailsByTaskId,
  getFileDetailsByTaskId
} from './byTaskId';

// Comment ID based queries
export {
  getProjectDetailsByCommentId,
  getUserDetailsByCommentId,
  getTaskDetailsByCommentId,
  getCommentDetailsByCommentId,
  getFileDetailsByCommentId
} from './byCommentId';

// File ID based queries
export {
  getProjectDetailsByFileId,
  getUserDetailsByFileId,
  getTaskDetailsByFileId,
  getCommentDetailsByFileId,
  getFileDetailsByFileId
} from './byFileId';

// Compound actions with Project ID combinations
export {
  getProjectDetailsByProjectIdAndTaskId,
  getProjectDetailsByProjectIdAndCommentId,
  getProjectDetailsByProjectIdAndFileId
} from './compoundActions/projectIdCombinations';

// Compound actions with Task ID combinations
export {
  getProjectDetailsByTaskIdAndCommentId,
  getProjectDetailsByTaskIdAndFileId
} from './compoundActions/taskIdCombinations';

// Compound actions with Comment ID combinations
export {
  getProjectDetailsByCommentIdAndFileId,
  getCommentDetailsByUserIdAndCommentIdAndTaskId,
  getFileDetailsByUserIdAndCommentIdAndTaskId,
  getProjectDetailsByUserIdAndCommentIdAndFileId,
  getUserDetailsByUserIdAndCommentIdAndFileId,
  getTaskDetailsByUserIdAndCommentIdAndFileId,
  getCommentDetailsByUserIdAndCommentIdAndFileId
} from './compoundActions/commentIdCombinations'; 