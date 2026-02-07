// // import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
// // import { useEffect, useState } from "react";
// // import { useRouter } from "expo-router";
// // import axios from "axios";
// // import { useAuthStore } from "../../../store/authStore";
// // import { API_BASE_URL } from "../../../constants/api";
// // import { Ionicons } from "@expo/vector-icons";

// // export default function Holidays() {
// //   const router = useRouter();
// //   const { token } = useAuthStore();
// //   const [holidays, setHolidays] = useState([]);

// //   const fetchHolidays = async () => {
// //     try {
// //       const res = await axios.get(`${API_BASE_URL}/holidays`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setHolidays(res.data);
// //     } catch (err) {
// //       console.log(err.response?.data || err.message);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchHolidays();
// //   }, []);

// //   const deleteHoliday = (id) => {
// //     Alert.alert("Delete Holiday?", "This cannot be undone", [
// //       { text: "Cancel" },
// //       {
// //         text: "Delete",
// //         style: "destructive",
// //         onPress: async () => {
// //           await axios.delete(`${API_BASE_URL}/holidays/${id}`, {
// //             headers: { Authorization: `Bearer ${token}` },
// //           });
// //           fetchHolidays();
// //         },
// //       },
// //     ]);
// //   };

// //   const renderItem = ({ item }) => (
// //     <View style={styles.card}>
// //       <View>
// //         <Text style={styles.name}>{item.name}</Text>
// //         <Text style={styles.date}>
// //           {new Date(item.date).toDateString()}
// //         </Text>
// //       </View>

// //       <View style={{ flexDirection: "row", gap: 14 }}>
// //         {/* EDIT */}
// //         <TouchableOpacity
// //           onPress={() =>
// //             router.push({
// //               pathname: "/(admin-tabs)/holidays/edit",
// //               params: {
// //                 id: item._id,
// //                 name: item.name,
// //                 date: item.date,
// //               },
// //             })
// //           }
// //         >
// //           <Ionicons name="create-outline" size={22} color="#0f172a" />
// //         </TouchableOpacity>

// //         {/* DELETE */}
// //         <TouchableOpacity onPress={() => deleteHoliday(item._id)}>
// //           <Ionicons name="trash-outline" size={22} color="red" />
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.header}>
// //         <Text style={styles.title}>Company Holidays</Text>
// //         <TouchableOpacity
// //           onPress={() => router.push("/(admin-tabs)/holidays/add")}
// //         >
// //           <Ionicons name="add-circle" size={32} color="#e74c3c" />
// //         </TouchableOpacity>
// //       </View>

// //       <FlatList
// //         data={holidays}
// //         keyExtractor={(item) => item._id}
// //         renderItem={renderItem}
// //       />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
// //   header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
// //   title: { fontSize: 18, fontWeight: "600" },
// //   card: {
// //     backgroundColor: "#fff",
// //     padding: 14,
// //     borderRadius: 12,
// //     marginBottom: 10,
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //   },
// //   name: { fontSize: 15, fontWeight: "500" },
// //   date: { color: "#64748b", fontSize: 12 },
// // });

// import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
// import { useEffect, useState } from "react";
// import { useRouter } from "expo-router";
// import axios from "axios";
// import { useAuthStore } from "../../../store/authStore";
// import { API_BASE_URL } from "../../../constants/api";
// import { Ionicons, Feather } from "@expo/vector-icons";

// const COLORS = ["#9CA3AF", "#EF4444", "#22C55E", "#F59E0B"];

// export default function Holidays() {
//   const router = useRouter();
//   const { token } = useAuthStore();
//   const [holidays, setHolidays] = useState([]);

//   const fetchHolidays = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/holidays`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setHolidays(res.data);
//     } catch (err) {
//       console.log(err.response?.data || err.message);
//     }
//   };

//   useEffect(() => {
//     fetchHolidays();
//   }, []);

//   const deleteHoliday = (id) => {
//     Alert.alert("Delete Holiday?", "This cannot be undone", [
//       { text: "Cancel" },
//       {
//         text: "Delete",
//         style: "destructive",
//         onPress: async () => {
//           await axios.delete(`${API_BASE_URL}/holidays/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           fetchHolidays();
//         },
//       },
//     ]);
//   };

//   const renderItem = ({ item, index }) => {
//     const barColor = COLORS[index % COLORS.length];

//     return (
//       <View style={styles.card}>
//         {/* LEFT COLOR BAR */}
//         <View style={[styles.sideBar, { backgroundColor: barColor }]} />

//         {/* CONTENT */}
//         <View style={{ flex: 1, marginLeft: 12 }}>
//           <Text style={styles.name}>{item.name}</Text>

//           <View style={styles.dateRow}>
//             <Ionicons name="calendar-outline" size={14} color="#ef4444" />
//             <Text style={styles.date}>
//               {new Date(item.date).toDateString()}
//             </Text>
//           </View>
//         </View>

//         {/* ACTIONS */}
//         <View style={styles.actions}>
//           <TouchableOpacity
//             style={styles.iconBtn}
//             onPress={() =>
//               router.push({
//                 pathname: "/(admin-tabs)/holidays/edit",
//                 params: {
//                   id: item._id,
//                   name: item.name,
//                   date: item.date,
//                 },
//               })
//             }
//           >
//             <Feather name="edit-2" size={16} color="#334155" />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.iconBtn}
//             onPress={() => deleteHoliday(item._id)}
//           >
//             <Feather name="trash" size={16} color="#ef4444" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.pageTitle}>Company Holidays</Text>

//       <FlatList
//         data={holidays}
//         keyExtractor={(item) => item._id}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 100 }}
//       />

//       {/* FLOATING ADD BUTTON */}
//       <TouchableOpacity
//         style={styles.fab}
//         onPress={() => router.push("/(admin-tabs)/holidays/add")}
//       >
//         <Ionicons name="add" size={28} color="#fff" />
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//     padding: 16,
//   },
//   pageTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     marginBottom: 14,
//   },

//   card: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderRadius: 18,
//     paddingVertical: 14,
//     paddingHorizontal: 10,
//     marginBottom: 14,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 3,
//   },

//   sideBar: {
//     width: 5,
//     height: "80%",
//     borderRadius: 10,
//   },

//   name: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#0f172a",
//   },

//   dateRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 4,
//   },

//   date: {
//     marginLeft: 6,
//     fontSize: 12,
//     color: "#64748b",
//   },

//   actions: {
//     flexDirection: "row",
//     gap: 8,
//   },

//   iconBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 12,
//     backgroundColor: "#F1F5F9",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   fab: {
//     position: "absolute",
//     bottom: 20,
//     right: 20,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "#ef4444",
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 6,
//   },
// });

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Ionicons, Feather } from "@expo/vector-icons";

import { useAuthStore } from "../../../store/authStore";
import { API_BASE_URL } from "../../../constants/api";
import DashboardHeader from "../../../components/DashboardHeader";

const COLORS = ["#9CA3AF", "#EF4444", "#22C55E", "#F59E0B"];

export default function Holidays() {
  const router = useRouter();
  const navigation = useNavigation();
  const { token } = useAuthStore();
  const [holidays, setHolidays] = useState([]);

  const fetchHolidays = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/holidays`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHolidays(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const deleteHoliday = (id) => {
    Alert.alert("Delete Holiday?", "This cannot be undone", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await axios.delete(`${API_BASE_URL}/holidays/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          fetchHolidays();
        },
      },
    ]);
  };

  const renderItem = ({ item, index }) => {
    const barColor = COLORS[index % COLORS.length];

    return (
      <View style={styles.card}>
        <View style={[styles.sideBar, { backgroundColor: barColor }]} />

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color="#ef4444" />
            <Text style={styles.date}>
              {new Date(item.date).toDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() =>
              router.push({
                pathname: "/(admin-tabs)/holidays/edit",
                params: {
                  id: item._id,
                  name: item.name,
                  date: item.date,
                },
              })
            }
          >
            <Feather name="edit-2" size={16} color="#334155" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => deleteHoliday(item._id)}
          >
            <Feather name="trash" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      {/* 🔥 HEADER + HAMBURGER */}
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <DashboardHeader
          onMenuPress={() =>
            navigation.dispatch(DrawerActions.openDrawer())
          }
        />
      </SafeAreaView>

      {/* 🔥 CONTENT */}
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Company Holidays</Text>

        <FlatList
          data={holidays}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />

        {/* FLOATING ADD */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/(admin-tabs)/holidays/add")}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f5f6fa" },

  headerSafe: {
    backgroundColor: "#f5f6fa",
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  sideBar: {
    width: 5,
    height: "80%",
    borderRadius: 10,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  date: {
    marginLeft: 6,
    fontSize: 12,
    color: "#64748b",
  },

  actions: {
    flexDirection: "row",
    gap: 8,
  },

  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
});

