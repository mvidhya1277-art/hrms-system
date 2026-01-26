import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MonthPicker({ month, onChange }) {
  const goPrev = () => {
    const [y, m] = month.split("-").map(Number);
    const newDate = new Date(y, m - 2);
    onChange(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}`);
  };

  const goNext = () => {
    const [y, m] = month.split("-").map(Number);
    const newDate = new Date(y, m);
    onChange(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}`);
  };

  const label = new Date(month + "-01").toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <View style={styles.container}>
      <Pressable onPress={goPrev}>
        <Ionicons name="chevron-back" size={24} />
      </Pressable>

      <Text style={styles.text}>{label}</Text>

      <Pressable onPress={goNext}>
        <Ionicons name="chevron-forward" size={24} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
