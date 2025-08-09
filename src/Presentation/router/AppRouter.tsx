import { Navigate, Route, Routes } from "react-router"

import { DashboardPage, HomePage, LoginPage, ProfilePage, RegisterPage } from "../Pages";
import { useEffect } from "react";
import { useAuthStore } from "../Hooks";
import { AppLayout } from "../Layouts";

export const AppRouter = () => {

  const { status, checkAuthToken } = useAuthStore();
  useEffect(() => {
    checkAuthToken();
  }, []);

  return (
    <Routes>
      {status === "authenticated" ? (
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
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

          <Route path="/*" element={<Navigate to="/" />} />
        </>

      )}

    </Routes>
  )
}
