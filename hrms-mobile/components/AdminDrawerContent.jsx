import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/authStore";

export default function AdminDrawerContent({ navigation }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const MenuItem = ({ icon, label, route, active }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.closeDrawer();
        if (route) router.push(route);
      }}
      style={[
        styles.menuItem,
        active && styles.activeItem,
      ]}
    >
      <Ionicons name={icon} size={20} color="#fff" />
      <Text style={styles.menuText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* PROFILE HEADER */}
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={26} color="#fff" />
        </View>
        <Text style={styles.name}>{user?.name || "Admin"}</Text>
        <Text style={styles.role}>HR Administrator</Text>
      </View>

      {/* MENU */}
      <View style={{ marginTop: 20 }}>
        <MenuItem
          icon="speedometer-outline"
          label="Dashboard"
          route="/(admin-tabs)/tabs/dashboard"
          active
        />
        <MenuItem
          icon="calendar-outline"
          label="Leaves"
          route="/(admin-tabs)/tabs/leaves"
        />

        <MenuItem
          icon="sunny-outline"
          label="Holidays"
          route="/(admin-tabs)/holidays"
        />
        
        <MenuItem
          icon="bar-chart-outline"
          label="Reports"
          route="/(admin-tabs)/reports"
        />
        <MenuItem
          icon="cash-outline"
          label="Payroll"
          route="/(admin-tabs)/tabs/employees/all-payrolls"
        />
        <MenuItem
          icon="settings-outline"
          label="Settings"
        />
      </View>

      {/* LOGOUT */}
      <TouchableOpacity
        style={styles.logout}
        onPress={async () => {
          await logout();
          router.replace("/login");
        }}
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#243447",
    padding: 20,
  },
  profile: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.15)",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e74c3c",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  role: {
    color: "#cbd5e1",
    fontSize: 12,
    marginTop: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 6,
  },
  activeItem: {
    backgroundColor: "#e74c3c",
  },
  menuText: {
    color: "#fff",
    marginLeft: 12,
    fontSize: 14,
  },
  logout: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e74c3c",
    padding: 12,
    borderRadius: 12,
  },
  logoutText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
  },
};
