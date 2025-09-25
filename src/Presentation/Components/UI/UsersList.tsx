import type { UserDto, FindAllUsersResponseInterface } from '@inventory/shared-types';
import { UserCard } from "./UserCard";

// Props interface using shared types for consistency
interface UsersListProps {
  users: UserDto[]; // Frontend User type (extends backend UserDto)
  onEditUser?: (user: UserDto) => void;
  onViewUser?: (user: UserDto) => void;
}

// Type alias for API response compatibility
type UsersApiResponse = FindAllUsersResponseInterface;

export const UsersList = ({ users, onEditUser, onViewUser }: UsersListProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Team Members ({users.length})
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your company's team members and their roles
        </p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {users.map((user) => (
          <UserCard 
            key={user.uuid} 
            user={user}
            onEdit={onEditUser}
            onView={onViewUser}
          />
        ))}
      </div>

      {users.length === 0 && (
        <div className="p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">No users found</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};