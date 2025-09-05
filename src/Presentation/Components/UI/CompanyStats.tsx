import { CheckCircleIcon, GroupIcon, SecurityIcon, UserCircleIcon } from "../../Assets/icons";

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

interface CompanyStatsProps {
  users: User[];
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

const StatCard = ({ title, value, icon, bgColor, iconColor }: StatCardProps) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
      <div className={`rounded-lg ${bgColor} p-4 flex items-center justify-center`}>
        <div className={`h-12 w-12 ${iconColor} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  </div>
);

export const CompanyStats = ({ users }: CompanyStatsProps) => {
  const departments = Array.from(new Set(users.map(user => user.department)));
  const activeUsers = users.filter(u => u.isActive).length;
  const administrators = users.filter(u => u.role === 'Administrator').length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={users.length}
        bgColor="bg-blue-100 dark:bg-blue-500/20"
        iconColor="text-blue-600 dark:text-blue-400"
        icon={
          <UserCircleIcon className="icon-2em" />
        }
      />

      <StatCard
        title="Active Users"
        value={activeUsers}
        bgColor="bg-green-100 dark:bg-green-500/20"
        iconColor="text-green-600 dark:text-green-400"
        icon={
          <CheckCircleIcon className="icon-2em" />
        }
      />

      <StatCard
        title="Departments"
        value={departments.length}
        bgColor="bg-purple-100 dark:bg-purple-500/20"
        iconColor="text-purple-600 dark:text-purple-400"
        icon={<GroupIcon className="icon-2em"/>}
      />

      <StatCard
        title="Administrators"
        value={administrators}
        bgColor="bg-orange-100 dark:bg-orange-500/20"
        iconColor="text-orange-600 dark:text-orange-400"
        icon={<SecurityIcon className="icon-2em"/>}
      />
    </div>
  );
};