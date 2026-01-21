import { View, Text, ScrollView, } from "react-native";
import { useEffect, useState } from "react";
// import DashboardCard from "../../components/DashboardCard";
// import HighlightCard from "../../components/HighlightCard";
import DashboardStatCard from "../../../components/DashboardStatCard";
import PerformanceCard from "../../../components/PerformanceCard";
import { getAdminDashboard } from "../../../services/dashboardService";
import { useAuthStore } from "../../../store/authStore";
import { useRouter, useNavigation } from "expo-router";


export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { token, logout } = useAuthStore();
  const router = useRouter();
  const navigation = useNavigation();


  useEffect(() => {
    if (!token) {
      setError("No auth token");
      return;
    }

    getAdminDashboard(token)
      .then(setData)
      .catch(err => {
        console.log("Dashboard error:", err.message);
        setError("Failed to load dashboard");
      });
  }, [token]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 16 }}>


      <Text style={{ fontSize: 18, fontWeight: "bold", marginVertical: 12 }}>
        Dashboard Overview
      </Text>

      {/* STAT GRID */}
      <View style={{ flexDirection: "row" }}>
        {/* <DashboardStatCard
          value={data.totalEmployees}
          label="All Active Employees"
          bgColor="#d6bebc"
        /> */}
        <DashboardStatCard
          value={data.totalEmployees}
          label="All Active Employees"
          bgColor="#d6bebc"
          onPress={() =>
            router.push({
              pathname: "tabs/employees/list",
              params: { filter: "active" },
            })
          }
        />
        {/* <DashboardStatCard
          value={data.presentToday}
          label="Checked In Today"
          bgColor="#92a5c7"
        /> */}
        <DashboardStatCard
          value={data.presentToday}
          label="Checked In Today"
          bgColor="#92a5c7"
          onPress={() =>
            router.push({
              pathname: "tabs/employees/list",
              params: { filter: "checkedin" },
            })
          }
        />
      </View>

      <View style={{ flexDirection: "row" }}>
        {/* <DashboardStatCard
          value={data.absentToday}
          label="Absent Today"
          bgColor="#c2ac8f"
        /> */}
        <DashboardStatCard
          value={data.absentToday}
          label="Absent Today"
          bgColor="#c2ac8f"
          onPress={() =>
            router.push({
              pathname: "tabs/employees/list",
              params: { filter: "absent" },
            })
          }
        />
        {/* <DashboardStatCard
          value={data.onLeave}
          label="On Leave Today"
          bgColor="#b098c7"
        /> */}
        <DashboardStatCard
          value={data.onLeave}
          label="On Leave Today"
          bgColor="#b098c7"
          onPress={() =>
            router.push({
              pathname: "tabs/employees/list",
              params: { filter: "onleave" },
            })
          }
        />
      </View>

      <View style={{ flexDirection: "row" }}>
        <DashboardStatCard
          value={data.pendingLeaves}
          label="Pending Leaves"
          bgColor="#8e9c66"
        />
        {/* <DashboardStatCard
          value={data.lateCheckins}
          label="Late Check-ins"
          bgColor="#c1db8f"
        /> */}
        <DashboardStatCard
          value={data.lateCheckins}
          label="Late Check-ins"
          bgColor="#c0b870"
          onPress={() =>
            router.push({
              pathname: "tabs/employees/list",
              params: { filter: "late" },
            })
          }
        />
      </View>

      <View style={{ flexDirection: "row" }}>
        <DashboardStatCard
          value={data.averageWorkingHoursYesterday}
          label="Yesterday's Avg Working Hours"
          bgColor="#8db9bb"
        />
        <DashboardStatCard
          value={data.totalWorkingHoursYesterday}
          label="Yesterday's Total Working Hours"
          bgColor="#c798a0"
        />
      </View>

      {/* PERFORMANCE */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginVertical: 12 }}>
        Yesterday's Performance Highlights
      </Text>

      <PerformanceCard
        name={data.longestWorkingEmployee?.name}
        hours={data.longestWorkingEmployee?.workingHours}
        badge="Top Performer"
        badgeColor="#e74c3c"
      />

      <PerformanceCard
        name={data.shortestWorkingEmployee?.name}
        hours={data.shortestWorkingEmployee?.workingHours}
        badge="Needs Support"
        badgeColor="#7f8c8d"
      />
    </ScrollView>
  );
}

