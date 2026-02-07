import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../constants/api";

// export const useAuthStore = create((set) => ({
//   user: null,            // ✅ MUST EXIST
//   token: null,
//   isLoading: false,
//   isHydrated: false,

//   login: async (phone, password) => {
//     set({ isLoading: true });
//     try {
//       const res = await axios.post(`${API_BASE_URL}/auth/login`, {
//         phone,
//         password,
//       });

//       const { token, user } = res.data;
//       console.log("🧑‍💼 LOGGED IN USER:", res.data.user);
//       console.log("🆔 ADMIN EMPLOYEE ID:", res.data.user?.employeeId);

//       await AsyncStorage.setItem("token", token);
//       await AsyncStorage.setItem("user", JSON.stringify(user));

//       set({
//         token,
//         user,              // ✅ stored here
//         isLoading: false,
//         isHydrated: true,
//       });
//     } catch (err) {
//       set({ isLoading: false });
//       throw err.response?.data?.message || "Login failed";
//     }
//   },



//   loadSession: async () => {
//     try {
//       const [token, user] = await Promise.all([
//         AsyncStorage.getItem("token"),
//         AsyncStorage.getItem("user"),
//       ]);

//       if (token && user) {
//         set({
//           token,
//           user: JSON.parse(user),
//           isHydrated: true,
//         });
//       } else {
//         set({ isHydrated: true });
//       }
//     } catch (error) {
//       console.error("Error loading session:", error);
//       set({ isHydrated: true });
//     }
//   },

//   logout: async () => {
//     try {
//       await AsyncStorage.clear();
//       set({ user: null, token: null, isHydrated: true });
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   },
// }));

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  employeeId: null,   // 🔥 ADD THIS
  isLoading: false,
  isHydrated: false,

  login: async (phone, password) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        phone,
        password,
      });

      const { token, user } = res.data;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      set({
        token,
        user,
        employeeId: user?.employeeId || null, // 🔥 STORE IT
        isLoading: false,
        isHydrated: true,
      });
    } catch (err) {
      set({ isLoading: false });
      throw err.response?.data?.message || "Login failed";
    }
  },

  loadSession: async () => {
    try {
      const [token, user] = await Promise.all([
        AsyncStorage.getItem("token"),
        AsyncStorage.getItem("user"),
      ]);

      if (token && user) {
        const parsed = JSON.parse(user);
        set({
          token,
          user: parsed,
          employeeId: parsed?.employeeId || null, // 🔥 RESTORE IT
          isHydrated: true,
        });
      } else {
        set({ isHydrated: true });
      }
    } catch (error) {
      console.error("Error loading session:", error);
      set({ isHydrated: true });
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.clear();
      set({
        user: null,
        token: null,
        employeeId: null, // 🔥 CLEAR
        isHydrated: true,
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  },
}));

