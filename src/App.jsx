import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import PrivateRoute from "./layouts/privateRoute";
import PublicRoute from "./layouts/publicRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/auth/*"
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      />
      <Route
        path="*"
        element={
          <PrivateRoute>
            <Navigate to="/dashboard/home" replace />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
