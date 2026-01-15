import { create } from "zustand";
import api from "@/lib/api";

const useAuthStore = create((set) => ({
  user: null,
  isCheckingAuth: true,

  signup: async (userData) => {
    try {
      const { data } = await api.post("/auth/register", userData);
      set({ user: data.user });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Signup failed" };
    }
  },

  login: async (credentials) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      

      // Check different structures to ensure we catch the user object
      if (data.user) {
        set({ user: data.user });
      } else if (data.username) {
        set({ user: data });
      } else {
        console.error("❌ ERROR: User data is missing in response!", data);
        set({ user: null });
      }

      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      console.error("Logout failed", error);
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const { data } = await api.get("/auth/check");
      set({ user: data });
    } catch (error) {
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));

export default useAuthStore;