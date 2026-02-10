import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardHeader from "../../../components/DashboardHeader";

export default function SettingsHome() {
  const router = useRouter();
  const navigation = useNavigation();

  const SettingCard = ({ icon, title, subtitle, onPress }) => (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={22} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSub}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      {/* Header */}
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <DashboardHeader
          title="Settings"
          onMenuPress={() =>
            navigation.dispatch(DrawerActions.openDrawer())
          }
        />
      </SafeAreaView>

      {/* Content */}
      <View style={styles.content}>
        <SettingCard
          icon="person-outline"
          title="Account & Profile"
          subtitle="Profile, password, theme"
          onPress={() => router.push("/(admin-tabs)/settings/account")}
        />

        {/* 🔒 Future cards (disabled for now) */}
        <SettingCard
          icon="business-outline"
          title="Company Settings"
          subtitle="Working days, timings"
          onPress={() => router.push ("/(admin-tabs)/settings/company")}
        />
        <SettingCard
          icon="time-outline"
          title="Attendance Rules"
          subtitle="Grace period, half-day"
          onPress={() => router.push("/(admin-tabs)/settings/attendance-rules")}
        />
        <SettingCard
          icon="cash-outline"
          title="Payroll Settings"
          subtitle="PF, ESI, deductions"
          onPress={() => {}}
        />
        <SettingCard
          icon="notifications-outline"
          title="Notifications"
          subtitle="Alerts & reminders"
          onPress={() => {}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f5f6fa" },
  headerSafe: { backgroundColor: "#f5f6fa" },
  content: { padding: 16 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  cardSub: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
});
