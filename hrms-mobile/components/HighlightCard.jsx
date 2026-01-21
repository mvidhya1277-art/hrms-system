import { View, Text } from "react-native";

export default function HighlightCard({ title, name, hours }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.name}>{name ? String(name) : "-"}</Text>
      <Text style={styles.hours}>
        {hours ? `${String(hours)} hrs` : "--:-- hrs"}
      </Text>
    </View>
  );
}

const styles = {
  card: {
    backgroundColor: "#f5f7fa",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  title: {
    fontSize: 13,
    color: "#555",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  hours: {
    fontSize: 16,
    color: "#71b173",
    marginTop: 2,
  },
};
