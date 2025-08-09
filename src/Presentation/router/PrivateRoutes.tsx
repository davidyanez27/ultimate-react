import { Navigate, Route, Routes } from "react-router"
import {DashboardPage, ProfilePage} from "../Pages"

export const PrivateRoutes = () => {
  return (
  <Routes>
    <Route path="/dashboard" element={<DashboardPage />}/>
    <Route path="/profile" element={<ProfilePage />} />

    <Route path="/*" element={<Navigate to="/dashboard" />} />

  </Routes>
  )
}
