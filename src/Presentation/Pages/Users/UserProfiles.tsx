

import { PageBreadcrumb } from "../../Components";
import { UserInfoCard } from "../../Components/UserProfile";
import UserMetaCard from "../../Components/UserProfile/UserMetaCard";

export const UserProfiles= () => {
  return (
    <>

      <PageBreadcrumb pageTitle="My Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">

        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
        </div>
      </div>
    </>
  );
}
