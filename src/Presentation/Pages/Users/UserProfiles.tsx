
import { PageBreadcrumb } from "../../Components";
import { UserAddressCard, UserInfoCard, UserMetaCard  } from "../../Components/UserProfile";

export const UserProfiles= () => {
  return (
    <>

      <PageBreadcrumb pageTitle="My Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">

        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard/>

        </div>
      </div>
    </>
  );
}
