import { useState } from "react";
import { PageBreadcrumb, CompanyStats, UserFilters, UsersList } from "../../Components";
import { useUsers } from "../../Hooks";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
  joinedDate: string;
  avatar?: string;
}

const mockUsers: User[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    role: "Administrator",
    department: "Engineering",
    isActive: true,
    joinedDate: "2023-01-15",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@company.com",
    role: "Manager",
    department: "Marketing",
    isActive: true,
    joinedDate: "2023-02-20",
  },
  {
    id: 3,
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@company.com",
    role: "Employee",
    department: "Sales",
    isActive: false,
    joinedDate: "2023-03-10",
  },
  {
    id: 4,
    firstName: "Sarah",
    lastName: "Wilson",
    email: "sarah.wilson@company.com",
    role: "Manager",
    department: "Human Resources",
    isActive: true,
    joinedDate: "2023-01-05",
  },
  {
    id: 5,
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@company.com",
    role: "Employee",
    department: "Finance",
    isActive: true,
    joinedDate: "2023-04-12",
  },
  {
    id: 6,
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@company.com",
    role: "Employee",
    department: "Operations",
    isActive: true,
    joinedDate: "2023-03-28",
  }
];

export const MyCompanyPage = () => {
  const { users: apiUsers, loading, error } = useUsers(1, 50);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Use API data or fallback to empty array
  const users = apiUsers || [];

  // Get unique roles and departments for filters
  const roles = Array.from(new Set(users.map(user => user.role).filter(Boolean)));
  const departments = Array.from(new Set(users.map(user => user.department).filter(Boolean)));

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "All" || user.role === filterRole;
    const matchesDepartment = filterDepartment === "All" || user.department === filterDepartment;
    const matchesStatus = filterStatus === "All" || 
      (filterStatus === "Active" && user.isActive) || 
      (filterStatus === "Inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });


  const handleEditUser = (user: User) => {
    console.log("Edit user:", user);
    // TODO: Navigate to edit user page or open edit modal
  };

  const handleViewUser = (user: User) => {
    console.log("View user:", user);
    // TODO: Navigate to user profile page or open view modal
  };

  if (loading) {
    return (
      <>
        <PageBreadcrumb pageTitle="My Company" />
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageBreadcrumb pageTitle="My Company" />
        <div className="p-6">
          <div className="text-red-600 dark:text-red-400">
            Error loading company data: {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle="My Company" />
      
      <div className="space-y-6">
        <CompanyStats users={users} />

        <UserFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterRole={filterRole}
          setFilterRole={setFilterRole}
          filterDepartment={filterDepartment}
          setFilterDepartment={setFilterDepartment}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          roles={roles}
          departments={departments}
        />

        <UsersList 
          users={filteredUsers}
          onEditUser={handleEditUser}
          onViewUser={handleViewUser}
        />
      </div>
    </>
  );
};