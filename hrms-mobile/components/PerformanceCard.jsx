import { View, Text } from "react-native";

export default function PerformanceCard({
  name,
  hours,
  badge,
  badgeColor,
}) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "--";

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name || "-"}</Text>
        <Text style={styles.hours}>{hours}</Text>
      </View>

      <View style={[styles.badge, { backgroundColor: badgeColor }]}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    </View>
  );
}

const styles = {
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    elevation: 2,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#e74c3c",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
  hours: {
    fontSize: 12,
    color: "#777",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "600",
  },
};
