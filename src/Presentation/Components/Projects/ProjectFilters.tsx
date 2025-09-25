interface ProjectFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  type: string;
  setType: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  priority: string;
  setPriority: (value: string) => void;
  projectManager: string;
  setProjectManager: (value: string) => void;
  dateRange: string;
  setDateRange: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  projectManagers: string[];
  selectedCount: number;
  onBulkAction: (action: 'activate' | 'hold' | 'complete' | 'cancel' | 'delete') => void;
  onCreateProject: () => void;
}

export const ProjectFilters = ({
  searchTerm,
  setSearchTerm,
  type,
  setType,
  status,
  setStatus,
  priority,
  setPriority,
  projectManager,
  setProjectManager,
  dateRange,
  setDateRange,
  sortBy,
  setSortBy,
  projectManagers,
  selectedCount,
  onBulkAction,
  onCreateProject
}: ProjectFiltersProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Project Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage projects and associated resources
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          {selectedCount > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedCount} selected
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onBulkAction('activate')}
                  className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                >
                  Activate
                </button>
                <button
                  onClick={() => onBulkAction('hold')}
                  className="px-3 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded hover:bg-yellow-200 dark:hover:bg-yellow-900/40 transition-colors"
                >
                  Hold
                </button>
                <button
                  onClick={() => onBulkAction('complete')}
                  className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                >
                  Complete
                </button>
                <button
                  onClick={() => onBulkAction('delete')}
                  className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
          <button
            onClick={onCreateProject}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <span>+</span>
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Search and Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by project name, description, manager, or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-1">
            <span>📊</span>
            <span>Export</span>
          </button>
          <button className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-1">
            <span>📈</span>
            <span>Reports</span>
          </button>
          <button className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-1">
            <span>📋</span>
            <span>Templates</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
        {/* Project Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Project Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Types</option>
            <option value="Menu Development">Menu Development</option>
            <option value="Catering Event">Catering Event</option>
            <option value="Promotion Campaign">Promotion Campaign</option>
            <option value="Training Program">Training Program</option>
            <option value="Equipment Setup">Equipment Setup</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Normal">Normal</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Project Manager Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Project Manager
          </label>
          <select
            value={projectManager}
            onChange={(e) => setProjectManager(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Managers</option>
            {projectManagers.map(manager => (
              <option key={manager} value={manager}>{manager}</option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Time</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="thisQuarter">This Quarter</option>
            <option value="active">Currently Active</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="startDate">Start Date</option>
            <option value="endDate">End Date</option>
            <option value="name">Name</option>
            <option value="status">Status</option>
            <option value="priority">Priority</option>
            <option value="budget">Budget</option>
            <option value="progress">Progress</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setSearchTerm("");
            setType("All");
            setStatus("All");
            setPriority("All");
            setProjectManager("All");
            setDateRange("All");
            setSortBy("startDate");
          }}
          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Clear Filters
        </button>
      </div>

      {/* Active Filter Tags */}
      <div className="flex flex-wrap gap-2">
        {searchTerm && (
          <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm">
            Search: "{searchTerm}"
            <button
              onClick={() => setSearchTerm("")}
              className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              ×
            </button>
          </span>
        )}
        {type !== "All" && (
          <span className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-full text-sm">
            Type: {type}
            <button
              onClick={() => setType("All")}
              className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
            >
              ×
            </button>
          </span>
        )}
        {status !== "All" && (
          <span className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 rounded-full text-sm">
            Status: {status}
            <button
              onClick={() => setStatus("All")}
              className="ml-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
            >
              ×
            </button>
          </span>
        )}
        {priority !== "All" && (
          <span className="inline-flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 rounded-full text-sm">
            Priority: {priority}
            <button
              onClick={() => setPriority("All")}
              className="ml-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300"
            >
              ×
            </button>
          </span>
        )}
        {projectManager !== "All" && (
          <span className="inline-flex items-center px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 rounded-full text-sm">
            Manager: {projectManager}
            <button
              onClick={() => setProjectManager("All")}
              className="ml-2 text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300"
            >
              ×
            </button>
          </span>
        )}
        {dateRange !== "All" && (
          <span className="inline-flex items-center px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-full text-sm">
            Date: {dateRange.replace(/([A-Z])/g, ' $1').toLowerCase()}
            <button
              onClick={() => setDateRange("All")}
              className="ml-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            >
              ×
            </button>
          </span>
        )}
      </div>

      {/* Status Legend */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Status Legend:</div>
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Planning</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">In Progress</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">On Hold</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Completed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Cancelled</span>
          </div>
        </div>
      </div>
    </div>
  );
};