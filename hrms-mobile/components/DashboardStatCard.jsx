import { TouchableOpacity, Text, View } from "react-native";

export default function DashboardStatCard({ value, label, onPress, bgColor }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flex: 1,
        backgroundColor: bgColor,
        padding: 16,
        borderRadius: 18,
        margin: 6,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "800" }}>{value}</Text>
      <Text style={{ marginTop: 4, color: "#334155" }}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = {
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    margin: 6,
  },
  value: {
    fontSize: 26,
    fontWeight: "bold",
  },
  label: {
    marginTop: 6,
    fontSize: 13,
    color: "#443a3a",
  },
};
