import React from 'react';

const ProjectCard = ({ project }) => {
  // Function to determine badge color based on status
  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      case 'archived':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  // Function to determine badge color based on priority
  const getPriorityBadgeColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-500 border-red-500';
      case 'medium':
        return 'text-orange-500 border-orange-500';
      case 'low':
        return 'text-green-500 border-green-500';
      default:
        return 'text-gray-500 border-gray-500';
    }
  };

  // Calculate project timeline and percentage complete
  const calculateTimeline = () => {
    if (!project.start_date || !project.end_date) return { percentage: 0, timeLeft: 'N/A' };
    
    const start = new Date(project.start_date);
    const end = new Date(project.end_date);
    const today = new Date();
    
    const totalDuration = end - start;
    const elapsedDuration = today - start;
    
    if (elapsedDuration < 0) return { percentage: 0, timeLeft: 'Not started' };
    if (elapsedDuration > totalDuration) return { percentage: 100, timeLeft: 'Complete' };
    
    const percentage = Math.floor((elapsedDuration / totalDuration) * 100);
    
    // Calculate time left
    const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    const timeLeft = daysLeft <= 0 ? 'Due today' : `${daysLeft} days left`;
    
    return { percentage, timeLeft };
  };
  
  const { percentage, timeLeft } = calculateTimeline();

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{project.name}</h3>
          <span className={`px-3 py-1 text-xs font-medium rounded-full text-white ${getStatusBadgeColor(project.status)}`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 h-20 overflow-hidden">{project.description}</p>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <span className="text-gray-500 text-sm mr-2">Priority:</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityBadgeColor(project.priority)}`}>
              {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
            </span>
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-500 text-sm mr-2">Timeline:</span>
            <span className="text-xs">{formatDate(project.start_date)} - {formatDate(project.end_date)}</span>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium text-gray-500">Progress</span>
            <span className="text-xs font-medium text-gray-500">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="mt-1 text-right">
            <span className="text-xs text-gray-500">{timeLeft}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 