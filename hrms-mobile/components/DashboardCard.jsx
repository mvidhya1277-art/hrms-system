import { View, Text } from "react-native";

export default function DashboardCard({ value, label, subLabel }) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>
        {value !== undefined && value !== null ? String(value) : "-"}
      </Text>

      <Text style={styles.label}>{label}</Text>

      {subLabel ? <Text style={styles.subLabel}>{subLabel}</Text> : null}
    </View>
  );
}

const styles = {
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  value: {
    fontSize: 26,
    fontWeight: "bold",
  },
  label: {
    fontSize: 14,
    marginTop: 4,
    color: "#333",
  },
  subLabel: {
    fontSize: 12,
    color: "#777",
  },
};
