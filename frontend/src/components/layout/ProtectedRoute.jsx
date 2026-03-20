import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { FullPageSpinner } from "./FullPageSpinner";

export const ProtectedRoute = () => {
  const { user, loading, initialized } = useContext(AuthContext);
  const location = useLocation();

  if (!initialized || loading) return <FullPageSpinner />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};
