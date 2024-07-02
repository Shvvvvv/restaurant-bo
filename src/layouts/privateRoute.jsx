import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/auth/sign-in" replace />;
}

PrivateRoute.displayName = "/src/layout/privateRoute.jsx";

export default PrivateRoute;
