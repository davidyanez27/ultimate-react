import { Navigate, Route, Routes } from "react-router"

import { CreateUserForm, HomePage, LoginPage, MyCompanyPage, UserProfiles , RegisterPage, ItemsPage, ItemCategorizationPage, LowStockAlertsPage, BarcodeManagementPage, SupplierManagementPage, ItemSupplierAssociationPage, PurchaseOrdersPage } from "../Pages";
import { useEffect } from "react";
import { useAuthStore } from "../Hooks";
import { AppLayout } from "../Layouts";
import { ProjectsPage } from "../Pages/Projects/ProjectsPage";

export const AppRouter = () => {

  const { status, checkAuthToken } = useAuthStore();
  useEffect(() => {
    
    checkAuthToken();
  }, []);

  return (
    <Routes>
      {status === "not-authenticated" || status === "checking"  ? (
        <>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/*" element={<Navigate to="/auth/login" />} />
        </>
      ) : (
        <>

          <Route path="/" element={<AppLayout />}>
              <Route index path="/" element={<HomePage />} />

              {/* Others Page */}
              <Route path="/user/profile" element={<UserProfiles />} />
              <Route path="/user/create" element={<CreateUserForm />} />
              <Route path="/user/company" element={<MyCompanyPage />} />
              <Route path="/items" element={<ItemsPage/>} />
              <Route path="/categories" element={<ItemCategorizationPage/>} />
              <Route path="/stock/alerts" element={<LowStockAlertsPage/>} />
              <Route path="/stock/barcodes" element={<BarcodeManagementPage/>} />
              <Route path="/suppliers" element={<SupplierManagementPage/>} />
              <Route path="/suppliers/items" element={<ItemSupplierAssociationPage/>} />
              <Route path="/suppliers/purchase-orders" element={<PurchaseOrdersPage/>} />
              <Route path="/projects" element={<ProjectsPage/>} />

            </Route>

          <Route path="/*" element={<Navigate to="/" />} />
        </>

      )}

    </Routes>
  )
}
