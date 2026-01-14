import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/authStore";

const Protect = ({ children }) => {
  const { user, isCheckingAuth } = useAuthStore(); // Assuming you might have an auth check flag, otherwise just use 'user'
  const location = useLocation();

  // If we are currently verifying the token (on refresh), show nothing or a spinner
  // (Optional: Only if your store has 'isCheckingAuth')
  // if (isCheckingAuth) return <div className="p-10 text-center">Loading...</div>;

  // If not logged in, kick them to login
  if (!user) {
    // "state={{ from: location }}" lets us redirect them BACK 
    // to the page they wanted after they login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in, let them see the page
  return children;
};

export default Protect;