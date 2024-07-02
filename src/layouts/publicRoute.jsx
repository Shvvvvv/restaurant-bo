import React from "react";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const user = localStorage.getItem("user");
  return !user ? children : <Navigate to="/dashboard/home" replace />;
}

export default PublicRoute;
