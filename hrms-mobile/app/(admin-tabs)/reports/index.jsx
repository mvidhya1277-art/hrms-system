// import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
// import { useRouter } from "expo-router";
// import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

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
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       <Text style={styles.header}>Reports</Text>

//       <ReportCard
//         title="Attendance Report"
//         subtitle="Present • Absent • Late"
//         icon={<Ionicons name="calendar" size={26} color="#fff" />}
//         onPress={() => router.push("/reports/attendance")}
//       />

//       <ReportCard
//         title="Working Hours Report"
//         subtitle="Days worked • Check-in time"
//         icon={<Ionicons name="time" size={26} color="#fff" />}
//         onPress={() => router.push("/reports/working-hours")}
//       />

//       <ReportCard
//         title="Leave Report"
//         subtitle="Approved • Pending • Rejected"
//         icon={<MaterialIcons name="event-note" size={26} color="#fff" />}
//         onPress={() => router.push("/reports/leave")}
//       />

//       <ReportCard
//         title="Payroll Report"
//         subtitle="Salary • Deductions • Net pay"
//         icon={<FontAwesome5 name="money-bill-wave" size={22} color="#fff" />}
//         onPress={() => router.push("/reports/payroll")}
//       />

//       <ReportCard
//         title="Performance Report"
//         subtitle="Top • Average • Needs support"
//         icon={<Ionicons name="trending-up" size={26} color="#fff" />}
//         onPress={() => router.push("/reports/performance")}
//       />
//     </ScrollView>
//   );
// }
// import { View, ScrollView,Text, StyleSheet } from "react-native";
// import { useNavigation } from "expo-router";
// import { DrawerActions } from "@react-navigation/native";

// import DashboardHeader from "../../../components/DashboardHeader"; // adjust path


// export default function ReportsScreen() {
//   const navigation = useNavigation();

//   return (
//     <View style={{ flex: 1, backgroundColor: "#f5f6fa" }}>
//       {/* ✅ Custom Header */}
//       <DashboardHeader
//         onMenuPress={() =>
//           navigation.dispatch(DrawerActions.openDrawer())
//         }
//       />

//       {/* ✅ Content */}
//       <ScrollView contentContainerStyle={{ padding: 16 }}>
//         {/* Attendance */}
//         <ReportsCard
//           icon="calendar"
//           title="Attendance Report"
//           subtitle="Present • Absent • Late"
//           route="/(admin-tabs)/reports/attendance"
//         />

//         <ReportsCard
//           icon="time"
//           title="Working Hours Report"
//           subtitle="Days worked • Check-in time"
//           route="/(admin-tabs)/reports/working-hours"
//         />

//         <ReportsCard
//           icon="document-text"
//           title="Leave Report"
//           subtitle="Approved • Pending • Rejected"
//           route="/(admin-tabs)/reports/leaves"
//         />

//         <ReportsCard
//           icon="cash"
//           title="Payroll Report"
//           subtitle="Salary • Deductions • Net pay"
//           route="/(admin-tabs)/reports/payroll"
//         />

//         <ReportsCard
//           icon="trending-up"
//           title="Performance Report"
//           subtitle="Top • Average • Needs support"
//           route="/(admin-tabs)/reports/performance"
//         />
//       </ScrollView>
//     </View>
//   );
// }

import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";

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
      {/* ✅ Reusable Header */}
      <DashboardHeader
        onMenuPress={() =>
          navigation.dispatch(DrawerActions.openDrawer())
        }
      />

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
  content: {
    padding: 16,
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


