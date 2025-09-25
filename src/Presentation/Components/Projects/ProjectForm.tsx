import { useState, useEffect } from "react";

interface Item {
  id: string;
  name: string;
  category: string;
  sku: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  unitCost: number;
  isActive: boolean;
}

interface ProjectItem {
  id: string;
  itemId: string;
  item: Item;
  quantityAllocated: number;
  quantityUsed: number;
  quantityRemaining: number;
  estimatedCost: number;
  actualCost: number;
  allocatedAt: string;
  lastUsedAt?: string;
  notes: string;
}

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
  items: ProjectItem[];
  totalItemCost: number;
  remainingBudget: number;
  progress: number;
  milestones: {
    id: string;
    name: string;
    description: string;
    dueDate: string;
    completed: boolean;
    completedAt?: string;
  }[];
  tags: string[];
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectFormProps {
  project?: Project | null;
  items: Item[];
  onSave: (projectData: Partial<Project>) => void;
  onCancel: () => void;
}

export const ProjectForm = ({ project, items, onSave, onCancel }: ProjectFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "Menu Development" as const,
    status: "Planning" as const,
    priority: "Normal" as const,
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    estimatedDuration: 30,
    budget: 0,
    actualCost: 0,
    currency: "USD",
    client: "",
    location: "",
    projectManager: "Current User",
    progress: 0,
    notes: "",
    createdBy: "Current User"
  });

  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [newTeamMember, setNewTeamMember] = useState("");
  const [projectItems, setProjectItems] = useState<Partial<ProjectItem>[]>([]);
  const [milestones, setMilestones] = useState<Partial<Project['milestones'][0]>[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        type: project.type,
        status: project.status,
        priority: project.priority,
        startDate: project.startDate,
        endDate: project.endDate,
        estimatedDuration: project.estimatedDuration,
        budget: project.budget,
        actualCost: project.actualCost,
        currency: project.currency,
        client: project.client || "",
        location: project.location || "",
        projectManager: project.projectManager,
        progress: project.progress,
        notes: project.notes,
        createdBy: project.createdBy
      });
      setTeamMembers(project.teamMembers);
      setProjectItems(project.items);
      setMilestones(project.milestones);
      setTags(project.tags);
    }
  }, [project]);

  // Auto-calculate end date when start date or duration changes
  useEffect(() => {
    if (formData.startDate && formData.estimatedDuration) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(startDate.getTime() + formData.estimatedDuration * 24 * 60 * 60 * 1000);
      setFormData(prev => ({
        ...prev,
        endDate: endDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.startDate, formData.estimatedDuration]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTeamMember = () => {
    if (newTeamMember.trim() && !teamMembers.includes(newTeamMember.trim())) {
      setTeamMembers(prev => [...prev, newTeamMember.trim()]);
      setNewTeamMember("");
    }
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(prev => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    const newItem: Partial<ProjectItem> = {
      id: Date.now().toString(),
      itemId: "",
      quantityAllocated: 1,
      quantityUsed: 0,
      quantityRemaining: 1,
      estimatedCost: 0,
      actualCost: 0,
      allocatedAt: new Date().toISOString(),
      notes: ""
    };
    setProjectItems(prev => [...prev, newItem]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    setProjectItems(prev => prev.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        
        // Auto-populate item details when item is selected
        if (field === 'itemId') {
          const selectedItem = items.find(item => item.id === value);
          if (selectedItem) {
            updatedItem.item = selectedItem;
            if (!updatedItem.estimatedCost) {
              updatedItem.estimatedCost = selectedItem.unitCost * (updatedItem.quantityAllocated || 1);
            }
          }
        }
        
        // Recalculate costs when quantity changes
        if (field === 'quantityAllocated' && updatedItem.item) {
          updatedItem.estimatedCost = updatedItem.item.unitCost * value;
          updatedItem.quantityRemaining = value - (updatedItem.quantityUsed || 0);
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const removeItem = (index: number) => {
    setProjectItems(prev => prev.filter((_, i) => i !== index));
  };

  const addMilestone = () => {
    const newMilestone = {
      id: Date.now().toString(),
      name: "",
      description: "",
      dueDate: formData.endDate,
      completed: false
    };
    setMilestones(prev => [...prev, newMilestone]);
  };

  const updateMilestone = (index: number, field: string, value: any) => {
    setMilestones(prev => prev.map((milestone, i) => 
      i === index ? { ...milestone, [field]: value } : milestone
    ));
  };

  const removeMilestone = (index: number) => {
    setMilestones(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotalItemCost = () => {
    return projectItems.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalItemCost = calculateTotalItemCost();
    const projectData = {
      ...formData,
      teamMembers,
      items: projectItems.filter(item => item.itemId) as ProjectItem[],
      milestones: milestones.filter(m => m.name) as Project['milestones'],
      tags,
      totalItemCost,
      remainingBudget: formData.budget - formData.actualCost - totalItemCost
    };
    
    onSave(projectData);
  };

  const steps = [
    { id: 1, title: "Basic Info", description: "Project details and settings" },
    { id: 2, title: "Team & Timeline", description: "Team members and scheduling" },
    { id: 3, title: "Resources", description: "Allocate items and budget" },
    { id: 4, title: "Milestones", description: "Project milestones and goals" },
    { id: 5, title: "Review", description: "Confirm and create project" }
  ];

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.description && formData.budget > 0;
      case 2:
        return formData.startDate && formData.endDate && formData.projectManager;
      case 3:
        return true; // Optional step
      case 4:
        return true; // Optional step
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {project ? "Edit Project" : "New Project"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {steps.find(s => s.id === currentStep)?.description}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mt-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                }`}>
                  {step.id}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`ml-4 w-8 h-0.5 ${
                    currentStep > step.id
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Project Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => updateFormData('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Project Type
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => updateFormData('type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Menu Development">Menu Development</option>
                          <option value="Catering Event">Catering Event</option>
                          <option value="Promotion Campaign">Promotion Campaign</option>
                          <option value="Training Program">Training Program</option>
                          <option value="Equipment Setup">Equipment Setup</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Priority
                        </label>
                        <select
                          value={formData.priority}
                          onChange={(e) => updateFormData('priority', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Low">Low</option>
                          <option value="Normal">Normal</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Budget *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={formData.budget}
                          onChange={(e) => updateFormData('budget', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Currency
                        </label>
                        <select
                          value={formData.currency}
                          onChange={(e) => updateFormData('currency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="CAD">CAD</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Client
                      </label>
                      <input
                        type="text"
                        value={formData.client}
                        onChange={(e) => updateFormData('client', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => updateFormData('location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tags
                      </label>
                      <div className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add tag..."
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(index)}
                              className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Team & Timeline */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Project Manager *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.projectManager}
                        onChange={(e) => updateFormData('projectManager', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Team Members
                      </label>
                      <div className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={newTeamMember}
                          onChange={(e) => setNewTeamMember(e.target.value)}
                          placeholder="Add team member..."
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={addTeamMember}
                          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {teamMembers.map((member, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <span className="text-sm text-gray-900 dark:text-white">{member}</span>
                            <button
                              type="button"
                              onClick={() => removeTeamMember(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.startDate}
                          onChange={(e) => updateFormData('startDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Duration (days)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.estimatedDuration}
                          onChange={(e) => updateFormData('estimatedDuration', parseInt(e.target.value) || 30)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date (Auto-calculated)
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => updateFormData('endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {project && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Progress (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.progress}
                          onChange={(e) => updateFormData('progress', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Resources */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Project Items
                  </h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    + Add Item
                  </button>
                </div>

                {projectItems.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No items allocated yet. Click "Add Item" to assign resources to this project.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {projectItems.map((item, index) => (
                    <div key={item.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Item *
                          </label>
                          <select
                            required
                            value={item.itemId || ""}
                            onChange={(e) => updateItem(index, 'itemId', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select item...</option>
                            {items.filter(item => item.isActive).map(item => (
                              <option key={item.id} value={item.id}>
                                {item.name} ({item.sku}) - ${item.unitCost}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Quantity Allocated
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantityAllocated || ""}
                            onChange={(e) => updateItem(index, 'quantityAllocated', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Estimated Cost
                          </label>
                          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-900 dark:text-white">
                            ${(item.estimatedCost || 0).toFixed(2)}
                          </div>
                        </div>

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="w-full px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Notes
                        </label>
                        <input
                          type="text"
                          value={item.notes || ""}
                          onChange={(e) => updateItem(index, 'notes', e.target.value)}
                          placeholder="Add notes about this item allocation..."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {item.item && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                          <p><strong>Available:</strong> {item.item.currentStock} {item.item.unit}</p>
                          <p><strong>Unit Cost:</strong> ${item.item.unitCost}</p>
                          <p><strong>Category:</strong> {item.item.category}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Budget Summary */}
                {projectItems.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Budget Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Budget:</span>
                          <span className="font-medium text-gray-900 dark:text-white">${formData.budget.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Estimated Item Cost:</span>
                          <span className="font-medium text-gray-900 dark:text-white">${calculateTotalItemCost().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2">
                          <span className="text-gray-600 dark:text-gray-400">Remaining Budget:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            ${(formData.budget - calculateTotalItemCost()).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Milestones */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Project Milestones
                  </h3>
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    + Add Milestone
                  </button>
                </div>

                {milestones.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No milestones defined yet. Click "Add Milestone" to set project goals.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Milestone Name
                          </label>
                          <input
                            type="text"
                            value={milestone.name || ""}
                            onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Due Date
                          </label>
                          <input
                            type="date"
                            value={milestone.dueDate || ""}
                            onChange={(e) => updateMilestone(index, 'dueDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeMilestone(index)}
                            className="w-full px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={milestone.description || ""}
                          onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {project && (
                        <div className="mt-2">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={milestone.completed || false}
                              onChange={(e) => updateMilestone(index, 'completed', e.target.checked)}
                              className="h-4 w-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              Completed
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => updateFormData('notes', e.target.value)}
                    placeholder="Add any additional project notes..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Project Review
                </h3>

                {/* Project Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Project Details</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Name:</strong> {formData.name}</div>
                        <div><strong>Type:</strong> {formData.type}</div>
                        <div><strong>Priority:</strong> {formData.priority}</div>
                        <div><strong>Manager:</strong> {formData.projectManager}</div>
                        <div><strong>Duration:</strong> {formData.estimatedDuration} days</div>
                        {formData.client && <div><strong>Client:</strong> {formData.client}</div>}
                        {formData.location && <div><strong>Location:</strong> {formData.location}</div>}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Budget & Resources</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Budget:</strong> ${formData.budget.toFixed(2)} {formData.currency}</div>
                        <div><strong>Estimated Item Cost:</strong> ${calculateTotalItemCost().toFixed(2)}</div>
                        <div><strong>Remaining Budget:</strong> ${(formData.budget - calculateTotalItemCost()).toFixed(2)}</div>
                        <div><strong>Team Members:</strong> {teamMembers.length}</div>
                        <div><strong>Items Allocated:</strong> {projectItems.length}</div>
                        <div><strong>Milestones:</strong> {milestones.length}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Timeline</h4>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between text-sm">
                      <span>Start: {formData.startDate}</span>
                      <span>End: {formData.endDate}</span>
                    </div>
                  </div>
                </div>

                {/* Items Summary */}
                {projectItems.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Allocated Items</h4>
                    <div className="space-y-2">
                      {projectItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.item?.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Quantity: {item.quantityAllocated}
                            </div>
                          </div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            ${item.estimatedCost?.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              
              {currentStep < steps.length ? (
                <button
                  type="button"
                  disabled={!isStepValid(currentStep)}
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                >
                  {project ? "Update Project" : "Create Project"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};