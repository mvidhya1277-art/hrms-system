// import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { BarChart } from "react-native-chart-kit";
// import { useEffect, useState } from "react";
// import axios from "axios";

// import { chartConfig, screenWidth } from "../../../constants/chartConfig";
// import { API_BASE_URL } from "../../../constants/api";
// import { useAuthStore } from "../../../store/authStore";

// export default function PerformanceReport() {
//   const { token } = useAuthStore();

//   const [loading, setLoading] = useState(true);
//   const [summary, setSummary] = useState({
//     top: 0,
//     average: 0,
//     needsSupport: 0,
//   });

//   useEffect(() => {
//     fetchPerformance();
//   }, []);

//   const fetchPerformance = async () => {
//     try {
//       const res = await axios.get(
//         `${API_BASE_URL}/reports/performance`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setSummary(res.data.summary);

//     } catch (err) {
//       console.error("Performance fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const chartData = {
//     labels: ["Top", "Average", "Needs Support"],
//     datasets: [{ data: [summary.top, summary.average, summary.needsSupport] }],
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <ActivityIndicator size="large" />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView>

//         <Text style={styles.title}>Performance Report</Text>

//         {/* Checkbox Style Cards */}
//         <View style={styles.listContainer}>
//           <Card label="Top Performers" value={summary.top} status="top" number={1} />
//           <Card label="Average Performers" value={summary.average} status="average" number={2} />
//           <Card label="Needs Support" value={summary.needsSupport} status="support" number={3} />
//         </View>

//         {/* Chart Container */}
//         <View style={styles.chartContainer}>
//           <BarChart
//             data={chartData}
//             width={screenWidth - 32}
//             height={240}
//             chartConfig={chartConfig}
//             fromZero={true}
//           />
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const Card = ({ label, value, status, number }) => {
//   // Get checkbox style based on status
//   const getCheckboxStyle = () => {
//     switch(status) {
//       case 'top':
//         return [styles.checkbox, styles.checkboxTop];
//       case 'average':
//         return [styles.checkbox, styles.checkboxAverage];
//       case 'support':
//         return [styles.checkbox, styles.checkboxSupport];
//       default:
//         return [styles.checkbox];
//     }
//   };

//   // Get checkbox text based on status
//   const getCheckboxText = () => {
//     switch(status) {
//       case 'top':
//         return "⭐";
//       case 'average':
//         return "📊";
//       case 'support':
//         return "🔄";
//       default:
//         return "";
//     }
//   };

//   return (
//     <View style={styles.card}>
//       <View style={styles.cardLeft}>
//         <View style={getCheckboxStyle()}>
//           <Text style={styles.checkboxText}>{getCheckboxText()}</Text>
//         </View>
//         <Text style={styles.cardLabel}>({number}) {label}</Text>
//       </View>
//       <Text style={styles.cardValue}>{value}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     padding: 16, 
//     backgroundColor: "#F5F7FB" 
//   },
//   title: { 
//     fontSize: 22, 
//     fontWeight: "700", 
//     marginBottom: 24,
//     color: "#1F2937"
//   },
//   listContainer: { 
//     marginBottom: 28 
//   },
//   chartContainer: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 16,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   card: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//     borderWidth: 1,
//     borderColor: "#E5E7EB"
//   },
//   cardLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   checkbox: {
//     width: 24,
//     height: 24,
//     borderRadius: 4,
//     borderWidth: 2,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   checkboxTop: {
//     backgroundColor: "#DCFCE7",
//     borderColor: "#22C55E",
//   },
//   checkboxAverage: {
//     backgroundColor: "#FEF3C7",
//     borderColor: "#F59E0B",
//   },
//   checkboxSupport: {
//     backgroundColor: "#FEE2E2",
//     borderColor: "#EF4444",
//   },
//   checkboxText: {
//     fontSize: 12,
//     color: "#1F2937"
//   },
//   cardLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: "#374151"
//   },
//   cardValue: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: "#1F2937"
//   }
// });

import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart } from "react-native-chart-kit";
import { useEffect, useState } from "react";
import axios from "axios";

import { chartConfig, screenWidth } from "../../../constants/chartConfig";
import { API_BASE_URL } from "../../../constants/api";
import { useAuthStore } from "../../../store/authStore";
import MonthPicker from "../../../components/MonthPicker";

export default function PerformanceReport() {
  const { token } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const [summary, setSummary] = useState({
    top: 0,
    average: 0,
    needsSupport: 0,
  });

  useEffect(() => {
    fetchPerformance();
  }, [month]); // ✅ refetch on month change

  const fetchPerformance = async () => {
    try {
      setLoading(true); // ✅ reset loader

      const res = await axios.get(
        `${API_BASE_URL}/reports/performance`,
        {
          params: { month }, // ✅ send month
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSummary(res.data.summary);

    } catch (err) {
      console.error("Performance fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ["Top", "Average", "Needs Support"],
    datasets: [{ data: [summary.top, summary.average, summary.needsSupport] }],
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        <Text style={styles.title}>Performance Report</Text>

        {/* ✅ MONTH PICKER */}
        <MonthPicker month={month} onChange={setMonth} />

        {/* Checkbox Style Cards */}
        <View style={styles.listContainer}>
          <Card label="Top Performers" value={summary.top} status="top" number={1} />
          <Card label="Average Performers" value={summary.average} status="average" number={2} />
          <Card label="Needs Support" value={summary.needsSupport} status="support" number={3} />
        </View>

        {/* Chart Container */}
        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            width={screenWidth - 32}
            height={240}
            chartConfig={chartConfig}
            fromZero={true}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- CARD ---------- */

const Card = ({ label, value, status, number }) => {
  const getCheckboxStyle = () => {
    switch (status) {
      case "top":
        return [styles.checkbox, styles.checkboxTop];
      case "average":
        return [styles.checkbox, styles.checkboxAverage];
      case "support":
        return [styles.checkbox, styles.checkboxSupport];
      default:
        return [styles.checkbox];
    }
  };

  const getCheckboxText = () => {
    switch (status) {
      case "top":
        return "⭐";
      case "average":
        return "📊";
      case "support":
        return "🔄";
      default:
        return "";
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={getCheckboxStyle()}>
          <Text style={styles.checkboxText}>{getCheckboxText()}</Text>
        </View>
        <Text style={styles.cardLabel}>({number}) {label}</Text>
      </View>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
};

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F7FB",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1F2937",
  },
  listContainer: {
    marginBottom: 28,
  },
  chartContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxTop: {
    backgroundColor: "#DCFCE7",
    borderColor: "#22C55E",
  },
  checkboxAverage: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
  },
  checkboxSupport: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
  },
  checkboxText: {
    fontSize: 12,
    color: "#1F2937",
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
});
