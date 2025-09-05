import { Navigate, Route, Routes } from "react-router"
import {DashboardPage} from "../Pages"

export const PrivateRoutes = () => {
  return (
  <Routes>
    <Route path="/dashboard" element={<DashboardPage />}/>

    <Route path="/*" element={<Navigate to="/dashboard" />} />

  </Routes>
  )
}
