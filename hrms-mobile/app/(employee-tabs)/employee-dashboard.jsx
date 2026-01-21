import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";

export default function EmployeeDashboard() {
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>Employee Dashboard</Text>
      <Text>Welcome, {user?.name}</Text>

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
