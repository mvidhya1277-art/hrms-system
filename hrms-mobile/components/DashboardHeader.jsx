import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardHeader({ onMenuPress }) {
  return (
    <View style={styles.container}>
      {/* Hamburger */}
      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons name="menu" size={26} color="#222" />
      </TouchableOpacity>

      {/* Title + Icon */}
      <View style={styles.center}>
        <Ionicons
          name="people"
          size={22}
          color="#e74c3c"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.title}>
          HRMS <Text style={{ color: "#e74c3c" }}>Pro</Text>
        </Text>
      </View>

      {/* Right spacer (keeps center aligned) */}
      <View style={{ width: 26 }} />
    </View>
  );
}

const styles = {
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  center: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
};
