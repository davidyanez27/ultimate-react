import { Navigate, Route, Routes } from "react-router"
import { LoginPage, RegisterPage } from "../Pages"

export const PublicRoutes = () => {
  return (
  <Routes>
    <Route path="/auth/login" element={<LoginPage />} />
    <Route path="/auth/register" element={<RegisterPage />} />
    <Route path="/*" element={<Navigate to="/auth/login" />} />
  </Routes>
  )
}
