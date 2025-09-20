
import { useEffect } from "react";
import { Navigate } from "react-router";
import { useAppContext } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { user, isLoadingUser, setShowUserLogin } = useAppContext();

  
  if (isLoadingUser) return null;

 
  if (!user) {
    useEffect(() => {
      setShowUserLogin(true);
    }, []);
    return <Navigate to="/" replace />;
  }


  return children;
};

export default ProtectedRoute;
