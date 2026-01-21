import { Tabs } from "expo-router";

export default function EmployeeTabs() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="employee-dashboard"
        options={{ title: "Dashboard" }}
      />
      <Tabs.Screen
        name="attendance"
        options={{ title: "Attendance" }}
      />
      <Tabs.Screen
        name="my-leaves"
        options={{ title: "My Leaves" }}
      />
    </Tabs>
  );
}