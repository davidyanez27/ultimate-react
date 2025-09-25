import { useState, useEffect } from "react";
import type { 
  UserDto, 
} from '@inventory/shared-types';
import { PageBreadcrumb, CompanyStats, UserFilters, UsersList } from "../../Components";
import { useUsersStore } from "../../Hooks";



export const MyCompanyPage = () => {
  const { users, loading, errorMessage, startFetchUsers, filters, updateUsersFilters, clearError } = useUsersStore();
  
  // Local state for any additional UI needs
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    startFetchUsers(1, 10);
  }, []);

  // Use filters from store
  const { searchTerm, role: filterRole, department: filterDepartment, status: filterStatus } = filters;

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


  const handleEditUser = (user: UserDto) => {
    setFormSubmitted(true);
    // TODO: Navigate to edit user page or open edit modal
    console.log('Editing user:', user.uuid || user.id);
  };

  const handleViewUser = (user: UserDto) => {
    setFormSubmitted(true);
    // TODO: Navigate to user profile page or open view modal  
    console.log('Viewing user:', user.uuid || user.id);
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


  return (
    <>
      <PageBreadcrumb pageTitle="My Company" />
      
      <div className="space-y-6">
        <CompanyStats users={users} />

        <UserFilters
          searchTerm={searchTerm}
          setSearchTerm={(value) => updateUsersFilters({ searchTerm: value })}
          filterRole={filterRole}
          setFilterRole={(value) => updateUsersFilters({ role: value })}
          filterDepartment={filterDepartment}
          setFilterDepartment={(value) => updateUsersFilters({ department: value })}
          filterStatus={filterStatus}
          setFilterStatus={(value) => updateUsersFilters({ status: value })}
          roles={roles}
          departments={departments}
        />

        <UsersList 
          users={filteredUsers}
          onEditUser={handleEditUser}
          onViewUser={handleViewUser}
        />
      </div>
      
      {errorMessage && 
        <div className="bg-red-100 border border-red-400 text-red-500 px-4 py-3 rounded relative mt-5 text-center" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
          <button 
            onClick={clearError} 
            className="ml-2 text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      }

    </>
  );
};