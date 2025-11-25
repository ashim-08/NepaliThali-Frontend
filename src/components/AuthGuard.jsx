import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const AuthGuard = ({ children }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-4xl font-bold">🍛</span>
          </div>
          <div className="spinner mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold gradient-text mb-2">NepaliThali</h2>
          <p className="text-gray-600">Loading your delicious experience...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthGuard;
