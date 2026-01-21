import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DashboardHeader from "../../../components/DashboardHeader";

export default function AdminTabsLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      
      {/* 🔝 TOP SAFE AREA ONLY */}
      <SafeAreaView edges={["top"]} style={{ paddingTop: 8 }}>
        <DashboardHeader />
      </SafeAreaView>

      {/* 📱 CONTENT + BOTTOM TABS */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 60,
            paddingBottom: 6,
          },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="employees"
          options={{
            title: "Employees",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="leaves"
          options={{
            title: "Leaves",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}



















