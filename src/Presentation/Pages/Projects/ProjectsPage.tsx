// import { useState, useEffect } from "react";
// import { PageBreadcrumb } from "../../Components";
// import { ProjectStats, ProjectFilters, ProjectList, ProjectForm } from "../../Components/Projects";

// interface Item {
//   id: string;
//   name: string;
//   category: string;
//   sku: string;
//   currentStock: number;
//   minimumStock: number;
//   unit: string;
//   unitCost: number;
//   isActive: boolean;
// }

// interface ProjectItem {
//   id: string;
//   itemId: string;
//   item: Item;
//   quantityAllocated: number;
//   quantityUsed: number;
//   quantityRemaining: number;
//   estimatedCost: number;
//   actualCost: number;
//   allocatedAt: string;
//   lastUsedAt?: string;
//   notes: string;
// }

// interface Project {
//   id: string;
//   name: string;
//   description: string;
//   type: 'Menu Development' | 'Catering Event' | 'Promotion Campaign' | 'Training Program' | 'Equipment Setup' | 'Other';
//   status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
//   priority: 'Low' | 'Normal' | 'High' | 'Critical';
//   startDate: string;
//   endDate: string;
//   estimatedDuration: number; // in days
//   actualDuration?: number;
//   budget: number;
//   actualCost: number;
//   currency: string;
//   client?: string;
//   location?: string;
//   teamMembers: string[];
//   projectManager: string;
//   items: ProjectItem[];
//   totalItemCost: number;
//   remainingBudget: number;
//   progress: number; // percentage 0-100
//   milestones: {
//     id: string;
//     name: string;
//     description: string;
//     dueDate: string;
//     completed: boolean;
//     completedAt?: string;
//   }[];
//   tags: string[];
//   notes: string;
//   attachments: {
//     id: string;
//     name: string;
//     type: string;
//     size: number;
//     uploadedAt: string;
//   }[];
//   createdBy: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export const ProjectsPage = () => {
//   // Mock data for items
//   const [items] = useState<Item[]>([
//     {
//       id: "1",
//       name: "The Cheerful Chomper",
//       category: "Mood Burgers",
//       sku: "MB-001",
//       currentStock: 45,
//       minimumStock: 20,
//       unit: "piece",
//       unitCost: 2.50,
//       isActive: true
//     },
//     {
//       id: "2", 
//       name: "Fiery Buffalo Fries",
//       category: "House Fries",
//       sku: "HF-001",
//       currentStock: 30,
//       minimumStock: 15,
//       unit: "portion",
//       unitCost: 1.75,
//       isActive: true
//     },
//     {
//       id: "3",
//       name: "Classic Wings",
//       category: "Fried Chicken and Wings", 
//       sku: "FC-001",
//       currentStock: 25,
//       minimumStock: 10,
//       unit: "piece",
//       unitCost: 0.85,
//       isActive: true
//     },
//     {
//       id: "4",
//       name: "Coca Cola",
//       category: "Beverages",
//       sku: "BV-001", 
//       currentStock: 100,
//       minimumStock: 50,
//       unit: "bottle",
//       unitCost: 0.65,
//       isActive: true
//     },
//     {
//       id: "5",
//       name: "Premium Beef Patty",
//       category: "Ingredients",
//       sku: "ING-001",
//       currentStock: 200,
//       minimumStock: 50,
//       unit: "piece",
//       unitCost: 2.25,
//       isActive: true
//     }
//   ]);

//   // Mock projects data
//   const [projects, setProjects] = useState<Project[]>([
//     {
//       id: "1",
//       name: "Summer Menu Launch 2024",
//       description: "Development and launch of new summer menu items including seasonal burgers, refreshing beverages, and limited-time offers.",
//       type: "Menu Development",
//       status: "In Progress",
//       priority: "High",
//       startDate: "2024-01-15",
//       endDate: "2024-03-15",
//       estimatedDuration: 60,
//       actualDuration: 35,
//       budget: 15000,
//       actualCost: 8750,
//       currency: "USD",
//       client: "The Cheerful Chomper Restaurant",
//       location: "Main Kitchen",
//       teamMembers: ["Chef Johnson", "Marketing Team", "Kitchen Staff"],
//       projectManager: "Sarah Wilson",
//       items: [
//         {
//           id: "1",
//           itemId: "1",
//           item: items[0],
//           quantityAllocated: 100,
//           quantityUsed: 60,
//           quantityRemaining: 40,
//           estimatedCost: 250.00,
//           actualCost: 150.00,
//           allocatedAt: "2024-01-15",
//           lastUsedAt: "2024-02-10",
//           notes: "Used for menu testing and staff training"
//         },
//         {
//           id: "2",
//           itemId: "2",
//           item: items[1],
//           quantityAllocated: 75,
//           quantityUsed: 45,
//           quantityRemaining: 30,
//           estimatedCost: 131.25,
//           actualCost: 78.75,
//           allocatedAt: "2024-01-20",
//           lastUsedAt: "2024-02-08",
//           notes: "Testing different seasoning combinations"
//         }
//       ],
//       totalItemCost: 228.75,
//       remainingBudget: 6250,
//       progress: 65,
//       milestones: [
//         {
//           id: "1",
//           name: "Recipe Development",
//           description: "Finalize all new menu item recipes",
//           dueDate: "2024-02-01",
//           completed: true,
//           completedAt: "2024-01-28"
//         },
//         {
//           id: "2",
//           name: "Staff Training",
//           description: "Train kitchen staff on new menu items",
//           dueDate: "2024-02-15",
//           completed: true,
//           completedAt: "2024-02-12"
//         },
//         {
//           id: "3",
//           name: "Marketing Materials",
//           description: "Create promotional materials and photography",
//           dueDate: "2024-02-28",
//           completed: false
//         },
//         {
//           id: "4",
//           name: "Menu Launch",
//           description: "Official launch of summer menu",
//           dueDate: "2024-03-15",
//           completed: false
//         }
//       ],
//       tags: ["Summer", "Menu", "Marketing", "Training"],
//       notes: "High priority project for Q1 revenue goals. Regular taste testing sessions scheduled weekly.",
//       attachments: [
//         {
//           id: "1",
//           name: "Summer_Menu_Concept.pdf",
//           type: "pdf",
//           size: 2048576,
//           uploadedAt: "2024-01-15"
//         }
//       ],
//       createdBy: "John Doe",
//       createdAt: "2024-01-10",
//       updatedAt: "2024-02-10"
//     },
//     {
//       id: "2", 
//       name: "Corporate Catering Event - TechCorp",
//       description: "Large scale catering event for TechCorp's annual conference. 500 attendees, 3-day event with breakfast, lunch, and dinner service.",
//       type: "Catering Event",
//       status: "Planning",
//       priority: "Critical",
//       startDate: "2024-03-01",
//       endDate: "2024-03-05",
//       estimatedDuration: 5,
//       budget: 25000,
//       actualCost: 2500,
//       currency: "USD",
//       client: "TechCorp Inc.",
//       location: "Convention Center Downtown",
//       teamMembers: ["Catering Team", "Service Staff", "Logistics Team"],
//       projectManager: "Mike Johnson",
//       items: [
//         {
//           id: "3",
//           itemId: "3",
//           item: items[2],
//           quantityAllocated: 1500,
//           quantityUsed: 0,
//           quantityRemaining: 1500,
//           estimatedCost: 1275.00,
//           actualCost: 0,
//           allocatedAt: "2024-02-15",
//           notes: "For lunch service all three days"
//         },
//         {
//           id: "4",
//           itemId: "4",
//           item: items[3],
//           quantityAllocated: 2000,
//           quantityUsed: 0,
//           quantityRemaining: 2000,
//           estimatedCost: 1300.00,
//           actualCost: 0,
//           allocatedAt: "2024-02-15",
//           notes: "Beverage service throughout the event"
//         }
//       ],
//       totalItemCost: 2575.00,
//       remainingBudget: 22500,
//       progress: 25,
//       milestones: [
//         {
//           id: "5",
//           name: "Menu Planning",
//           description: "Finalize catering menu with client",
//           dueDate: "2024-02-20",
//           completed: true,
//           completedAt: "2024-02-18"
//         },
//         {
//           id: "6",
//           name: "Ingredient Procurement", 
//           description: "Order all ingredients and supplies",
//           dueDate: "2024-02-25",
//           completed: false
//         },
//         {
//           id: "7",
//           name: "Staff Coordination",
//           description: "Coordinate catering and service staff",
//           dueDate: "2024-02-28",
//           completed: false
//         },
//         {
//           id: "8",
//           name: "Event Execution",
//           description: "Execute 3-day catering event",
//           dueDate: "2024-03-05",
//           completed: false
//         }
//       ],
//       tags: ["Catering", "Corporate", "Large Event", "Multi-Day"],
//       notes: "High-profile client. Ensure premium quality and professional service. Backup plans in place for all meals.",
//       attachments: [
//         {
//           id: "2",
//           name: "TechCorp_Catering_Contract.pdf",
//           type: "pdf",
//           size: 1536000,
//           uploadedAt: "2024-02-10"
//         }
//       ],
//       createdBy: "Sarah Wilson",
//       createdAt: "2024-02-05",
//       updatedAt: "2024-02-18"
//     },
//     {
//       id: "3",
//       name: "Valentine's Day Promotion",
//       description: "Special Valentine's Day promotion featuring romantic dinner packages and couples' deals. Limited time offer for February.",
//       type: "Promotion Campaign",
//       status: "Completed",
//       priority: "Normal",
//       startDate: "2024-01-20",
//       endDate: "2024-02-14",
//       estimatedDuration: 25,
//       actualDuration: 25,
//       budget: 5000,
//       actualCost: 4750,
//       currency: "USD",
//       location: "Main Restaurant",
//       teamMembers: ["Marketing Team", "Kitchen Staff", "Service Team"],
//       projectManager: "Emily Davis",
//       items: [
//         {
//           id: "5",
//           itemId: "1",
//           item: items[0],
//           quantityAllocated: 200,
//           quantityUsed: 185,
//           quantityRemaining: 15,
//           estimatedCost: 500.00,
//           actualCost: 462.50,
//           allocatedAt: "2024-01-25",
//           lastUsedAt: "2024-02-14",
//           notes: "Featured in romantic dinner packages"
//         }
//       ],
//       totalItemCost: 462.50,
//       remainingBudget: 250,
//       progress: 100,
//       milestones: [
//         {
//           id: "9",
//           name: "Promotion Design",
//           description: "Create Valentine's promotional materials",
//           dueDate: "2024-01-25",
//           completed: true,
//           completedAt: "2024-01-24"
//         },
//         {
//           id: "10",
//           name: "Marketing Launch",
//           description: "Launch marketing campaign",
//           dueDate: "2024-02-01",
//           completed: true,
//           completedAt: "2024-01-31"
//         },
//         {
//           id: "11",
//           name: "Event Execution",
//           description: "Valentine's Day service",
//           dueDate: "2024-02-14",
//           completed: true,
//           completedAt: "2024-02-14"
//         }
//       ],
//       tags: ["Valentine's", "Promotion", "Marketing", "Seasonal"],
//       notes: "Successful promotion with 95% of allocated items used. Strong customer response and positive feedback.",
//       attachments: [],
//       createdBy: "Emily Davis",
//       createdAt: "2024-01-15",
//       updatedAt: "2024-02-15"
//     },
//     {
//       id: "4",
//       name: "Kitchen Equipment Upgrade",
//       description: "Upgrade kitchen equipment including new grills, fryers, and refrigeration units to improve efficiency and food quality.",
//       type: "Equipment Setup",
//       status: "On Hold",
//       priority: "Normal",
//       startDate: "2024-03-01",
//       endDate: "2024-04-30",
//       estimatedDuration: 60,
//       budget: 50000,
//       actualCost: 5000,
//       currency: "USD",
//       location: "Main Kitchen",
//       teamMembers: ["Facilities Team", "Kitchen Manager", "Equipment Vendors"],
//       projectManager: "David Brown",
//       items: [],
//       totalItemCost: 0,
//       remainingBudget: 45000,
//       progress: 10,
//       milestones: [
//         {
//           id: "12",
//           name: "Equipment Selection",
//           description: "Select and approve new equipment",
//           dueDate: "2024-02-15",
//           completed: true,
//           completedAt: "2024-02-12"
//         },
//         {
//           id: "13",
//           name: "Budget Approval",
//           description: "Secure budget approval from management",
//           dueDate: "2024-02-28",
//           completed: false
//         }
//       ],
//       tags: ["Equipment", "Kitchen", "Upgrade", "Infrastructure"],
//       notes: "Project on hold pending budget approval. Equipment vendors identified and quotes received.",
//       attachments: [
//         {
//           id: "3",
//           name: "Equipment_Quotes.xlsx",
//           type: "xlsx",
//           size: 512000,
//           uploadedAt: "2024-02-12"
//         }
//       ],
//       createdBy: "David Brown",
//       createdAt: "2024-01-20",
//       updatedAt: "2024-02-12"
//     }
//   ]);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingProject, setEditingProject] = useState<Project | null>(null);
//   const [filters, setFilters] = useState({
//     searchTerm: "",
//     type: "All",
//     status: "All",
//     priority: "All",
//     projectManager: "All",
//     dateRange: "All",
//     sortBy: "startDate"
//   });

//   // Filter projects based on search and filters
//   const filteredProjects = projects.filter(project => {
//     const matchesSearch = `${project.name} ${project.description} ${project.projectManager} ${project.client || ''}`
//       .toLowerCase()
//       .includes(filters.searchTerm.toLowerCase());
    
//     const matchesType = filters.type === "All" || project.type === filters.type;
//     const matchesStatus = filters.status === "All" || project.status === filters.status;
//     const matchesPriority = filters.priority === "All" || project.priority === filters.priority;
//     const matchesProjectManager = filters.projectManager === "All" || project.projectManager === filters.projectManager;
    
//     let matchesDateRange = true;
//     if (filters.dateRange !== "All") {
//       const projectStart = new Date(project.startDate);
//       const today = new Date();
//       const daysDiff = Math.floor((projectStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
//       switch (filters.dateRange) {
//         case "thisWeek":
//           matchesDateRange = daysDiff >= -7 && daysDiff <= 7;
//           break;
//         case "thisMonth":
//           matchesDateRange = daysDiff >= -30 && daysDiff <= 30;
//           break;
//         case "thisQuarter":
//           matchesDateRange = daysDiff >= -90 && daysDiff <= 90;
//           break;
//         case "active":
//           const today_date = new Date();
//           const start = new Date(project.startDate);
//           const end = new Date(project.endDate);
//           matchesDateRange = start <= today_date && end >= today_date;
//           break;
//       }
//     }

//     return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesProjectManager && matchesDateRange;
//   }).sort((a, b) => {
//     switch (filters.sortBy) {
//       case "name":
//         return a.name.localeCompare(b.name);
//       case "status":
//         return a.status.localeCompare(b.status);
//       case "priority":
//         const priorityOrder = { 'Critical': 4, 'High': 3, 'Normal': 2, 'Low': 1 };
//         return priorityOrder[b.priority] - priorityOrder[a.priority];
//       case "budget":
//         return b.budget - a.budget;
//       case "progress":
//         return b.progress - a.progress;
//       case "endDate":
//         return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
//       case "startDate":
//       default:
//         return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
//     }
//   });

//   // Get unique project managers for filters
//   const projectManagers = Array.from(new Set(projects.map(project => project.projectManager)));

//   const handleCreateProject = () => {
//     setEditingProject(null);
//     setIsFormOpen(true);
//   };

//   const handleEditProject = (project: Project) => {
//     setEditingProject(project);
//     setIsFormOpen(true);
//   };

//   const handleDeleteProject = (project: Project) => {
//     if (confirm(`Are you sure you want to delete project "${project.name}"?`)) {
//       setProjects(prev => prev.filter(p => p.id !== project.id));
//       console.log('Deleting project:', project.id);
//     }
//   };

//   const handleChangeStatus = (project: Project, newStatus: Project['status']) => {
//     setProjects(prev => prev.map(p => 
//       p.id === project.id 
//         ? { 
//             ...p, 
//             status: newStatus, 
//             updatedAt: new Date().toISOString(),
//             ...(newStatus === 'Completed' && { 
//               progress: 100,
//               actualDuration: Math.ceil((new Date().getTime() - new Date(p.startDate).getTime()) / (1000 * 60 * 60 * 24))
//             })
//           }
//         : p
//     ));
//   };

//   const handleDuplicateProject = (project: Project) => {
//     const newProject: Project = {
//       ...project,
//       id: Date.now().toString(),
//       name: `${project.name} (Copy)`,
//       status: 'Planning',
//       progress: 0,
//       actualCost: 0,
//       actualDuration: undefined,
//       startDate: new Date().toISOString().split('T')[0],
//       endDate: new Date(Date.now() + project.estimatedDuration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//       items: project.items.map(item => ({
//         ...item,
//         id: `${Date.now()}-${item.id}`,
//         quantityUsed: 0,
//         quantityRemaining: item.quantityAllocated,
//         actualCost: 0,
//         lastUsedAt: undefined
//       })),
//       milestones: project.milestones.map(milestone => ({
//         ...milestone,
//         id: `${Date.now()}-${milestone.id}`,
//         completed: false,
//         completedAt: undefined
//       })),
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     };
    
//     setProjects(prev => [...prev, newProject]);
//   };

//   const handleSaveProject = (projectData: Partial<Project>) => {
//     if (editingProject) {
//       // Update existing project
//       setProjects(prev => prev.map(p => 
//         p.id === editingProject.id 
//           ? { ...p, ...projectData, updatedAt: new Date().toISOString() }
//           : p
//       ));
//     } else {
//       // Create new project
//       const newProject: Project = {
//         id: Date.now().toString(),
//         items: [],
//         totalItemCost: 0,
//         remainingBudget: (projectData.budget || 0),
//         progress: 0,
//         actualCost: 0,
//         milestones: [],
//         attachments: [],
//         createdBy: "Current User",
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         ...projectData
//       } as Project;
      
//       setProjects(prev => [...prev, newProject]);
//     }
//     setIsFormOpen(false);
//     setEditingProject(null);
//   };

//   const handleSelectProject = (projectId: string) => {
//     setSelectedProjects(prev => 
//       prev.includes(projectId) 
//         ? prev.filter(id => id !== projectId)
//         : [...prev, projectId]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedProjects.length === filteredProjects.length) {
//       setSelectedProjects([]);
//     } else {
//       setSelectedProjects(filteredProjects.map(project => project.id));
//     }
//   };

//   const handleBulkAction = (action: 'activate' | 'hold' | 'complete' | 'cancel' | 'delete') => {
//     if (action === 'delete') {
//       if (confirm(`Are you sure you want to delete ${selectedProjects.length} projects?`)) {
//         setProjects(prev => prev.filter(p => !selectedProjects.includes(p.id)));
//         setSelectedProjects([]);
//       }
//     } else {
//       const statusMap = {
//         activate: 'In Progress' as const,
//         hold: 'On Hold' as const,
//         complete: 'Completed' as const,
//         cancel: 'Cancelled' as const
//       };
      
//       const newStatus = statusMap[action];
//       setProjects(prev => prev.map(p => 
//         selectedProjects.includes(p.id) 
//           ? { 
//               ...p, 
//               status: newStatus, 
//               updatedAt: new Date().toISOString(),
//               ...(action === 'complete' && { progress: 100 })
//             }
//           : p
//       ));
//       setSelectedProjects([]);
//     }
//   };

//   if (loading) {
//     return (
//       <>
//         <PageBreadcrumb pageTitle="Projects" />
//         <div className="space-y-6">
//           <div className="animate-pulse">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//               <div className="h-32 bg-gray-200 rounded"></div>
//               <div className="h-32 bg-gray-200 rounded"></div>
//               <div className="h-32 bg-gray-200 rounded"></div>
//               <div className="h-32 bg-gray-200 rounded"></div>
//             </div>
//             <div className="h-20 bg-gray-200 rounded mb-4"></div>
//             <div className="h-96 bg-gray-200 rounded"></div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <PageBreadcrumb pageTitle="Projects" />
      
//       <div className="space-y-6">
//         <ProjectStats projects={projects} />

//         <ProjectFilters
//           searchTerm={filters.searchTerm}
//           setSearchTerm={(value) => setFilters(prev => ({ ...prev, searchTerm: value }))}
//           type={filters.type}
//           setType={(value) => setFilters(prev => ({ ...prev, type: value }))}
//           status={filters.status}
//           setStatus={(value) => setFilters(prev => ({ ...prev, status: value }))}
//           priority={filters.priority}
//           setPriority={(value) => setFilters(prev => ({ ...prev, priority: value }))}
//           projectManager={filters.projectManager}
//           setProjectManager={(value) => setFilters(prev => ({ ...prev, projectManager: value }))}
//           dateRange={filters.dateRange}
//           setDateRange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
//           sortBy={filters.sortBy}
//           setSortBy={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
//           projectManagers={projectManagers}
//           selectedCount={selectedProjects.length}
//           onBulkAction={handleBulkAction}
//           onCreateProject={handleCreateProject}
//         />

//         <ProjectList 
//           projects={filteredProjects}
//           selectedProjects={selectedProjects}
//           onSelectProject={handleSelectProject}
//           onSelectAll={handleSelectAll}
//           onEditProject={handleEditProject}
//           onDeleteProject={handleDeleteProject}
//           onChangeStatus={handleChangeStatus}
//           onDuplicateProject={handleDuplicateProject}
//         />
//       </div>

//       {/* Project Form Modal */}
//       {isFormOpen && (
//         <ProjectForm
//           project={editingProject}
//           items={items}
//           onSave={handleSaveProject}
//           onCancel={() => {
//             setIsFormOpen(false);
//             setEditingProject(null);
//           }}
//         />
//       )}
      
//       {error && 
//         <div className="bg-red-100 border border-red-400 text-red-500 px-4 py-3 rounded relative mt-5 text-center" role="alert">
//           <span className="block sm:inline">{error}</span>
//           <button 
//             onClick={() => setError(null)}
//             className="ml-2 text-red-700 hover:text-red-900"
//           >
//             ×
//           </button>
//         </div>
//       }
//     </>
//   );
// };


export const ProjectsPage = () => {
  return (
    <div>ProjectsPage</div>
  )
}
