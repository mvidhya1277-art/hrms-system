import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../constants/api";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  employeeId: null,   // 🔥 ADD THIS
  isLoading: false,
  isHydrated: false,
  
  setAuth: ({ token, user }) =>
    set({
      token,
      user,
      theme: user?.theme || "light",
    }),

  setTheme: (theme) =>
    set((state) => ({
      theme,
      user: { ...state.user, theme },
    })),

  login: async (phone, password) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        phone,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

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

// import { create } from "zustand";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import { API_BASE_URL } from "../constants/api";

// export const useAuthStore = create((set) => ({
//   user: null,
//   token: null,
//   employeeId: null,
//   isLoading: false,
//   isHydrated: false,

//   theme: "light", // 🌗 single source of truth

//   /* ======================
//      AUTH SETTERS
//   ====================== */
//   setAuth: async ({ token, user }) => {
//     await AsyncStorage.setItem("token", token);
//     await AsyncStorage.setItem("user", JSON.stringify(user));
//     await AsyncStorage.setItem("theme", user?.theme || "light");

//     set({
//       token,
//       user,
//       employeeId: user?.employeeId || null,
//       theme: user?.theme || "light",
//       isHydrated: true,
//     });
//   },

//   /* ======================
//      THEME HANDLING
//   ====================== */
//   setTheme: async (theme) => {
//     await AsyncStorage.setItem("theme", theme);

//     set((state) => ({
//       theme,
//       user: state.user ? { ...state.user, theme } : state.user,
//     }));
//   },

//   /* ======================
//      LOGIN
//   ====================== */
//   login: async (phone, password) => {
//     set({ isLoading: true });
//     try {
//       const res = await axios.post(`${API_BASE_URL}/auth/login`, {
//         phone,
//         password,
//       });

//       const { token, user } = res.data;

//       await AsyncStorage.setItem("token", token);
//       await AsyncStorage.setItem("user", JSON.stringify(user));
//       await AsyncStorage.setItem("theme", user?.theme || "light");

//       set({
//         token,
//         user,
//         employeeId: user?.employeeId || null,
//         theme: user?.theme || "light",
//         isLoading: false,
//         isHydrated: true,
//       });
//     } catch (err) {
//       set({ isLoading: false });
//       throw err.response?.data?.message || "Login failed";
//     }
//   },

//   /* ======================
//      SESSION RESTORE
//   ====================== */
//   loadSession: async () => {
//     try {
//       const [token, user, theme] = await Promise.all([
//         AsyncStorage.getItem("token"),
//         AsyncStorage.getItem("user"),
//         AsyncStorage.getItem("theme"),
//       ]);

//       if (token && user) {
//         const parsedUser = JSON.parse(user);

//         set({
//           token,
//           user: parsedUser,
//           employeeId: parsedUser?.employeeId || null,
//           theme: theme || parsedUser?.theme || "light",
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

//   /* ======================
//      LOGOUT
//   ====================== */
//   logout: async () => {
//     try {
//       await AsyncStorage.multiRemove(["token", "user", "theme"]);
//       set({
//         user: null,
//         token: null,
//         employeeId: null,
//         theme: "light",
//         isHydrated: true,
//       });
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   },
// }));

