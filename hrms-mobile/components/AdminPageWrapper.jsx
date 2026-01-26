import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HEADER_HEIGHT = 56; // must match DashboardHeader height

export default function AdminPageWrapper({ children }) {
  return (
    <View style={styles.root}>
      {/* Top safe area only (header already rendered by tabs layout) */}
      <SafeAreaView edges={["top"]} />

      {/* Page content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: HEADER_HEIGHT, // 🔥 THIS fixes the “too top” issue
  },
});
