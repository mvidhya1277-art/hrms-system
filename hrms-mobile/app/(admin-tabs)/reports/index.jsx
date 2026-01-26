import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import DashboardHeader from "../../../components/DashboardHeader";

export default function ReportsHome() {
  const router = useRouter();
  const navigation = useNavigation();

  const ReportCard = ({ title, subtitle, icon, onPress }) => (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      {/* ✅ Safe Header (fixes status bar overlap) */}
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <DashboardHeader
          onMenuPress={() =>
            navigation.dispatch(DrawerActions.openDrawer())
          }
        />
      </SafeAreaView>

      {/* ✅ Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ReportCard
          title="Attendance Report"
          subtitle="Present • Absent • Late"
          icon={<Ionicons name="calendar" size={26} color="#fff" />}
          onPress={() =>
            router.push("/(admin-tabs)/reports/attendance")
          }
        />

        <ReportCard
          title="Working Hours Report"
          subtitle="Days worked • Check-in time"
          icon={<Ionicons name="time" size={26} color="#fff" />}
          onPress={() =>
            router.push("/(admin-tabs)/reports/working-hours")
          }
        />

        <ReportCard
          title="Leave Report"
          subtitle="Approved • Pending • Rejected"
          icon={<MaterialIcons name="event-note" size={26} color="#fff" />}
          onPress={() =>
            router.push("/(admin-tabs)/reports/leave")
          }
        />

        <ReportCard
          title="Payroll Report"
          subtitle="Salary • Deductions • Net pay"
          icon={
            <FontAwesome5
              name="money-bill-wave"
              size={22}
              color="#fff"
            />
          }
          onPress={() =>
            router.push("/(admin-tabs)/reports/payroll")
          }
        />

        <ReportCard
          title="Performance Report"
          subtitle="Top • Average • Needs support"
          icon={<Ionicons name="trending-up" size={26} color="#fff" />}
          onPress={() =>
            router.push("/(admin-tabs)/reports/performance")
          }
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },

  /* Header safe area */
  headerSafe: {
    backgroundColor: "#f5f6fa",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,      // ✅ correct spacing
    paddingBottom: 16,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f2d3d",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  textContainer: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },

  cardSubtitle: {
    fontSize: 13,
    color: "#cfd8dc",
    marginTop: 4,
  },
});

// import { ScrollView, Pressable, View, Text, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";
// import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
// import AdminPageWrapper from "../../../components/AdminPageWrapper";

// export default function ReportsHome() {
//   const router = useRouter();

//   const ReportCard = ({ title, subtitle, icon, onPress }) => (
//     <Pressable style={styles.card} onPress={onPress}>
//       <View style={styles.iconContainer}>{icon}</View>
//       <View style={styles.textContainer}>
//         <Text style={styles.cardTitle}>{title}</Text>
//         <Text style={styles.cardSubtitle}>{subtitle}</Text>
//       </View>
//     </Pressable>
//   );

//   return (
//     <AdminPageWrapper>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <ReportCard
//           title="Attendance Report"
//           subtitle="Present • Absent • Late"
//           icon={<Ionicons name="calendar" size={26} color="#fff" />}
//           onPress={() => router.push("/(admin-tabs)/reports/attendance")}
//         />

//         <ReportCard
//           title="Working Hours Report"
//           subtitle="Days worked • Check-in time"
//           icon={<Ionicons name="time" size={26} color="#fff" />}
//           onPress={() => router.push("/(admin-tabs)/reports/working-hours")}
//         />

//         <ReportCard
//           title="Leave Report"
//           subtitle="Approved • Pending • Rejected"
//           icon={<MaterialIcons name="event-note" size={26} color="#fff" />}
//           onPress={() => router.push("/(admin-tabs)/reports/leave")}
//         />

//         <ReportCard
//           title="Payroll Report"
//           subtitle="Salary • Deductions • Net pay"
//           icon={<FontAwesome5 name="money-bill-wave" size={22} color="#fff" />}
//           onPress={() => router.push("/(admin-tabs)/reports/payroll")}
//         />

//         <ReportCard
//           title="Performance Report"
//           subtitle="Top • Average • Needs support"
//           icon={<Ionicons name="trending-up" size={26} color="#fff" />}
//           onPress={() => router.push("/(admin-tabs)/reports/performance")}
//         />
//       </ScrollView>
//     </AdminPageWrapper>
//   );
// }


// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: "#f5f6fa",
//   },

//   /* Header safe area */
//   headerSafe: {
//     backgroundColor: "#f5f6fa",
//   },

//   content: {
//     paddingHorizontal: 16,
//     paddingTop: 16,      // ✅ correct spacing
//     paddingBottom: 16,
//   },

//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#1f2d3d",
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 3,
//   },

//   iconContainer: {
//     width: 46,
//     height: 46,
//     borderRadius: 23,
//     backgroundColor: "#e74c3c",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 14,
//   },

//   textContainer: {
//     flex: 1,
//   },

//   cardTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#fff",
//   },

//   cardSubtitle: {
//     fontSize: 13,
//     color: "#cfd8dc",
//     marginTop: 4,
//   },
// });




