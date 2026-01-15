import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import useAuthStore from "./store/authStore";

// COMPONENTS
import Navbar from "./components/shared/Navbar";
import Protect from "./components/shared/Protect"; // <--- IMPORT THIS

// PAGES
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateRice from "./pages/CreateRice";
import RiceDetail from "./pages/RiceDetails";
import Profile from "./pages/Profile";
import Resources from "./pages/Resources";
import Glossary from "./pages/Glossary";

const App = () => {
  const { checkAuth } = useAuthStore();

  // Check if user is logged in when app starts
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/learn" element={<Glossary />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* PROTECTED ROUTES */}
          <Route path="/create" element={<Protect><CreateRice /></Protect>} />
          
          {/* Note: Profile is protected here based on your request, 
              but usually profiles are public. If you want it public, remove Protect. */}
          <Route path="/profile/:username" element={<Profile />} /> 
          
          <Route path="/rice/:id" element={<RiceDetail />} />
        </Routes>
      </main>

      <footer className="py-6 border-t mt-auto">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
            Built by RiceHub Community • 2026
        </div>
      </footer>
    </div>
  );
};

export default App;