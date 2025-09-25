import { useState } from "react";

interface Project {
  id: string;
  name: string;
  type: 'Menu Development' | 'Catering Event' | 'Promotion Campaign' | 'Training Program' | 'Equipment Setup' | 'Other';
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Normal' | 'High' | 'Critical';
  startDate: string;
  endDate: string;
  budget: number;
  actualCost: number;
  progress: number;
  totalItemCost: number;
  milestones: {
    completed: boolean;
  }[];
  items: {
    quantityAllocated: number;
    quantityUsed: number;
  }[];
}

interface ProjectStatsProps {
  projects: Project[];
}

export const ProjectStats = ({ projects }: ProjectStatsProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const planningProjects = projects.filter(p => p.status === 'Planning').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const onHoldProjects = projects.filter(p => p.status === 'On Hold').length;
  const cancelledProjects = projects.filter(p => p.status === 'Cancelled').length;

  // Financial calculations
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalActualCost = projects.reduce((sum, p) => sum + p.actualCost, 0);
  const totalItemCost = projects.reduce((sum, p) => sum + p.totalItemCost, 0);
  const budgetUtilization = totalBudget > 0 ? (totalActualCost / totalBudget) * 100 : 0;

  // Project type breakdown
  const typeStats = {
    'Menu Development': projects.filter(p => p.type === 'Menu Development').length,
    'Catering Event': projects.filter(p => p.type === 'Catering Event').length,
    'Promotion Campaign': projects.filter(p => p.type === 'Promotion Campaign').length,
    'Training Program': projects.filter(p => p.type === 'Training Program').length,
    'Equipment Setup': projects.filter(p => p.type === 'Equipment Setup').length,
    'Other': projects.filter(p => p.type === 'Other').length
  };

  // Priority breakdown
  const priorityStats = {
    critical: projects.filter(p => p.priority === 'Critical' && p.status !== 'Completed' && p.status !== 'Cancelled').length,
    high: projects.filter(p => p.priority === 'High' && p.status !== 'Completed' && p.status !== 'Cancelled').length,
    normal: projects.filter(p => p.priority === 'Normal' && p.status !== 'Completed' && p.status !== 'Cancelled').length,
    low: projects.filter(p => p.priority === 'Low' && p.status !== 'Completed' && p.status !== 'Cancelled').length
  };

  // Progress and milestone analytics
  const averageProgress = projects.length > 0 
    ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length 
    : 0;

  const totalMilestones = projects.reduce((sum, p) => sum + p.milestones.length, 0);
  const completedMilestones = projects.reduce((sum, p) => 
    sum + p.milestones.filter(m => m.completed).length, 0);
  const milestoneCompletionRate = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  // Resource utilization
  const totalItemsAllocated = projects.reduce((sum, p) => 
    sum + p.items.reduce((itemSum, item) => itemSum + item.quantityAllocated, 0), 0);
  const totalItemsUsed = projects.reduce((sum, p) => 
    sum + p.items.reduce((itemSum, item) => itemSum + item.quantityUsed, 0), 0);
  const resourceUtilization = totalItemsAllocated > 0 ? (totalItemsUsed / totalItemsAllocated) * 100 : 0;

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects.toString(),
      change: "+3",
      trend: "up",
      description: `${activeProjects} active, ${planningProjects} planning`,
      icon: "📋"
    },
    {
      title: "Average Progress",
      value: `${averageProgress.toFixed(1)}%`,
      change: "+5.2%",
      trend: "up",
      description: "Across all active projects",
      icon: "📈"
    },
    {
      title: "Budget Utilization",
      value: `${budgetUtilization.toFixed(1)}%`,
      change: "+2.1%",
      trend: "up",
      description: `$${(totalActualCost / 1000).toFixed(1)}K of $${(totalBudget / 1000).toFixed(1)}K`,
      icon: "💰"
    },
    {
      title: "Milestone Completion",
      value: `${milestoneCompletionRate.toFixed(1)}%`,
      change: "+8.3%",
      trend: "up",
      description: `${completedMilestones} of ${totalMilestones} milestones`,
      icon: "🎯"
    }
  ];

  const statusStats = [
    {
      title: "Planning",
      value: planningProjects.toString(),
      percentage: totalProjects > 0 ? ((planningProjects / totalProjects) * 100).toFixed(1) : "0",
      color: "blue",
      icon: "📝"
    },
    {
      title: "In Progress",
      value: activeProjects.toString(),
      percentage: totalProjects > 0 ? ((activeProjects / totalProjects) * 100).toFixed(1) : "0",
      color: "green",
      icon: "🚀"
    },
    {
      title: "On Hold",
      value: onHoldProjects.toString(),
      percentage: totalProjects > 0 ? ((onHoldProjects / totalProjects) * 100).toFixed(1) : "0",
      color: "yellow",
      icon: "⏸️"
    },
    {
      title: "Completed",
      value: completedProjects.toString(),
      percentage: totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(1) : "0",
      color: "emerald",
      icon: "✅"
    }
  ];

  const topProjectTypes = Object.entries(typeStats)
    .filter(([_, count]) => count > 0)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 3);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      case 'green':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400';
      case 'yellow':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400';
      case 'emerald':
        return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400';
      case 'red':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
      case 'purple':
        return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400';
      case 'orange':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400';
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

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {stat.title}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </span>
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.description}
                </p>
              </div>
              <div className="text-3xl ml-4">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Breakdown & Priority Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Project Status
            </h3>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {statusStats.map((stat, index) => (
              <div key={index} className={`p-4 rounded-lg ${getColorClasses(stat.color)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="text-lg font-bold">{stat.value}</span>
                </div>
                <div className="text-sm font-medium mb-1">{stat.title}</div>
                <div className="text-xs opacity-75">{stat.percentage}% of total</div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Active Project Priorities
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🚨</span>
                <span className="text-sm font-medium text-red-900 dark:text-red-400">Critical</span>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-400">
                {priorityStats.critical} projects
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
              <div className="flex items-center space-x-3">
                <span className="text-xl">⚡</span>
                <span className="text-sm font-medium text-orange-900 dark:text-orange-400">High</span>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-400">
                {priorityStats.high} projects
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center space-x-3">
                <span className="text-xl">📊</span>
                <span className="text-sm font-medium text-blue-900 dark:text-blue-400">Normal</span>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400">
                {priorityStats.normal} projects
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center space-x-3">
                <span className="text-xl">📋</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-400">Low</span>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-400">
                {priorityStats.low} projects
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview & Project Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Financial Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Total Budget</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">All projects combined</div>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                ${(totalBudget / 1000).toFixed(1)}K
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Actual Costs</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Current spending</div>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                ${(totalActualCost / 1000).toFixed(1)}K
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Item Costs</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Inventory allocation</div>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                ${(totalItemCost / 1000).toFixed(1)}K
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Resource Utilization</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Items used vs allocated</div>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {resourceUtilization.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Top Project Types */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Project Types
          </h3>
          <div className="space-y-3">
            {topProjectTypes.map(([type, count], index) => (
              <div key={type} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getTypeIcon(type)}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{type}</span>
                </div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {count} project{count !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
            {topProjectTypes.length === 0 && (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No projects yet
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm">
                <span className="mr-2">📊</span>
                Analytics
              </button>
              <button className="flex items-center justify-center px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors text-sm">
                <span className="mr-2">📈</span>
                Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};