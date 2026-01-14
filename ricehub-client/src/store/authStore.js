import { create } from "zustand";
import api from "@/lib/api";

const useAuthStore = create((set) => ({
  user: null,
  isCheckingAuth: true, // Used to show a loading spinner if needed

  // 1. SIGNUP
  signup: async (userData) => {
    try {
      const { data } = await api.post("/auth/register", userData);
      set({ user: data });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Signup failed" };
    }
  },

  // 2. LOGIN
  login: async (credentials) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      set({ user: data });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  },

  // 3. LOGOUT
  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      console.error("Logout failed", error);
    }
  },

  // 4. CHECK AUTH (This was missing!)
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      // We will create this endpoint in the backend next
      const { data } = await api.get("/auth/check"); 
      set({ user: data });
    } catch (error) {
      set({ user: null }); // Not logged in
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));

export default useAuthStore;