interface Project {
  id: string;
  name: string;
  description: string;
  type: 'Menu Development' | 'Catering Event' | 'Promotion Campaign' | 'Training Program' | 'Equipment Setup' | 'Other';
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Normal' | 'High' | 'Critical';
  startDate: string;
  endDate: string;
  estimatedDuration: number;
  actualDuration?: number;
  budget: number;
  actualCost: number;
  currency: string;
  client?: string;
  location?: string;
  teamMembers: string[];
  projectManager: string;
  items: {
    quantityAllocated: number;
    quantityUsed: number;
  }[];
  totalItemCost: number;
  remainingBudget: number;
  progress: number;
  milestones: {
    id: string;
    name: string;
    completed: boolean;
    dueDate: string;
  }[];
  tags: string[];
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectListProps {
  projects: Project[];
  selectedProjects: string[];
  onSelectProject: (projectId: string) => void;
  onSelectAll: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
  onChangeStatus: (project: Project, newStatus: Project['status']) => void;
  onDuplicateProject: (project: Project) => void;
}

export const ProjectList = ({
  projects,
  selectedProjects,
  onSelectProject,
  onSelectAll,
  onEditProject,
  onDeleteProject,
  onChangeStatus,
  onDuplicateProject
}: ProjectListProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      case 'In Progress':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400';
      case 'On Hold':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400';
      case 'Completed':
        return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400';
      case 'Cancelled':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
      case 'High':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400';
      case 'Normal':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      case 'Low':
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical': return '🚨';
      case 'High': return '⚡';
      case 'Normal': return '📊';
      case 'Low': return '📋';
      default: return '📋';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Planning': return '📝';
      case 'In Progress': return '🚀';
      case 'On Hold': return '⏸️';
      case 'Completed': return '✅';
      case 'Cancelled': return '❌';
      default: return '📋';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Menu Development': return '🍽️';
      case 'Catering Event': return '🎪';
      case 'Promotion Campaign': return '📢';
      case 'Training Program': return '🎓';
      case 'Equipment Setup': return '⚙️';
      case 'Other': return '📁';
      default: return '📋';
    }
  };

  const getAvailableStatusChanges = (currentStatus: string): Project['status'][] => {
    switch (currentStatus) {
      case 'Planning':
        return ['In Progress', 'On Hold', 'Cancelled'];
      case 'In Progress':
        return ['On Hold', 'Completed', 'Cancelled'];
      case 'On Hold':
        return ['In Progress', 'Cancelled'];
      case 'Completed':
        return [];
      case 'Cancelled':
        return ['Planning'];
      default:
        return [];
    }
  };

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Projects ({projects.length})
          </h3>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Grid View
            </button>
            <button className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded">
              List View
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={projects.length > 0 && selectedProjects.length === projects.length}
                  onChange={onSelectAll}
                  className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Project Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Timeline & Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Team & Resources
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Budget & Costs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status & Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {projects.map((project) => {
              const daysRemaining = calculateDaysRemaining(project.endDate);
              const completedMilestones = project.milestones.filter(m => m.completed).length;
              const milestoneProgress = project.milestones.length > 0 
                ? (completedMilestones / project.milestones.length) * 100 
                : 0;
              const availableStatusChanges = getAvailableStatusChanges(project.status);
              
              return (
                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => onSelectProject(project.id)}
                      className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </td>
                  
                  {/* Project Details */}
                  <td className="px-6 py-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-xl">
                          {getTypeIcon(project.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {project.name}
                            </p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(project.priority)}`}>
                              <span className="mr-1">{getPriorityIcon(project.priority)}</span>
                              {project.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 line-clamp-2">
                            {project.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Type: {project.type}
                          </p>
                          {project.client && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Client: {project.client}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{project.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Timeline & Progress */}
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Start: {formatDate(project.startDate)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        End: {formatDate(project.endDate)}
                      </p>
                      
                      {daysRemaining >= 0 ? (
                        <p className={`text-xs ${daysRemaining <= 7 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          {daysRemaining} days remaining
                        </p>
                      ) : (
                        <p className="text-xs text-red-600 dark:text-red-400">
                          {Math.abs(daysRemaining)} days overdue
                        </p>
                      )}

                      {/* Milestones */}
                      {project.milestones.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Milestones: {completedMilestones}/{project.milestones.length}
                          </p>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1 mt-1">
                            <div 
                              className="bg-green-500 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${milestoneProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Team & Resources */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {project.projectManager}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Project Manager
                      </p>
                      
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Team: {project.teamMembers.length} members
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {project.teamMembers.slice(0, 2).map((member, index) => (
                            <div key={index}>{member}</div>
                          ))}
                          {project.teamMembers.length > 2 && (
                            <div>+{project.teamMembers.length - 2} more</div>
                          )}
                        </div>
                      </div>

                      {project.items.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Items: {project.items.length} allocated
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Usage: {project.items.reduce((sum, item) => sum + item.quantityUsed, 0)} / {project.items.reduce((sum, item) => sum + item.quantityAllocated, 0)}
                          </p>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Budget & Costs */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatCurrency(project.budget, project.currency)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Actual: {formatCurrency(project.actualCost, project.currency)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Items: {formatCurrency(project.totalItemCost, project.currency)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Remaining: {formatCurrency(project.remainingBudget, project.currency)}
                      </p>
                      
                      {/* Budget utilization bar */}
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full transition-all duration-300 ${
                              project.actualCost > project.budget ? 'bg-red-500' : 'bg-blue-500'
                            }`}
                            style={{ 
                              width: `${Math.min((project.actualCost / project.budget) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {((project.actualCost / project.budget) * 100).toFixed(1)}% used
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Status & Priority */}
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        <span className="mr-1">{getStatusIcon(project.status)}</span>
                        {project.status}
                      </span>
                      
                      {availableStatusChanges.length > 0 && (
                        <div className="relative">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                onChangeStatus(project, e.target.value as Project['status']);
                                e.target.value = '';
                              }
                            }}
                            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            defaultValue=""
                          >
                            <option value="" disabled>Change Status</option>
                            {availableStatusChanges.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEditProject(project)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm"
                        title="Edit project"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDuplicateProject(project)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                        title="Duplicate project"
                      >
                        📋
                      </button>
                      <button
                        className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 text-sm"
                        title="View details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => onDeleteProject(project)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm"
                        title="Delete project"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {projects.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No projects found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Create your first project to start managing tasks and resources.
          </p>
          <button className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
            New Project
          </button>
        </div>
      )}
    </div>
  );
};