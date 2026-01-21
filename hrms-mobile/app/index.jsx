import { useEffect } from "react";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuthStore } from "../store/authStore";

export default function Index() {
  const { user, isHydrated, loadSession } = useAuthStore();

  useEffect(() => {
    loadSession(); // 🔥 THIS WAS MISSING
  }, []);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (user.userType === "admin") {
    return <Redirect href="/(admin-tabs)/tabs/dashboard" />;
  }

  return <Redirect href="/(employee-tabs)/employee-dashboard" />;
}
