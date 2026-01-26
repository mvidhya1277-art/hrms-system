// import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { BarChart } from "react-native-chart-kit";
// import { useEffect, useState } from "react";
// import axios from "axios";

// import { chartConfig, screenWidth } from "../../../constants/chartConfig";
// import { API_BASE_URL } from "../../../constants/api";
// import { useAuthStore } from "../../../store/authStore";

// export default function WorkingHoursReport() {
//   const { token } = useAuthStore();

//   const [loading, setLoading] = useState(true);
//   const [summary, setSummary] = useState({
//     totalPresentDays: 0,
//     averageWorkingHours: 0,
//     lateCount: 0,
//   });

//   useEffect(() => {
//     fetchWorkingHours();
//   }, []);

//   const fetchWorkingHours = async () => {
//     try {
//       const res = await axios.get(
//         `${API_BASE_URL}/reports/working-hours`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setSummary(res.data.summary);

//     } catch (err) {
//       console.error("Working hours fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const chartData = {
//     labels: ["Average Working Hours"],
//     datasets: [{ data: [summary.averageWorkingHours] }],
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

//         <Text style={styles.title}>Working Hours Report</Text>

//         {/* Checkbox Style Cards */}
//         <View style={styles.listContainer}>
//           <Card label="Days Worked" value={summary.totalPresentDays} status="days" number={1} />
//           <Card label="Avg Hours/Day" value={`${summary.averageWorkingHours}h`} status="hours" number={2} />
//           <Card label="Late Arrivals" value={summary.lateCount} status="late" number={3} />
//         </View>

//         {/* Chart Container */}
//         <View style={styles.chartContainer}>
//           <BarChart
//             data={chartData}
//             width={screenWidth - 32}
//             height={240}
//             yAxisSuffix="h"
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
//       case 'days':
//         return [styles.checkbox, styles.checkboxDays];
//       case 'hours':
//         return [styles.checkbox, styles.checkboxHours];
//       case 'late':
//         return [styles.checkbox, styles.checkboxLate];
//       default:
//         return [styles.checkbox];
//     }
//   };

//   // Get checkbox text based on status
//   const getCheckboxText = () => {
//     switch(status) {
//       case 'days':
//         return "📅";
//       case 'hours':
//         return "⏰";
//       case 'late':
//         return "⏱️";
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
//   checkboxDays: {
//     backgroundColor: "#DBEAFE",
//     borderColor: "#3B82F6",
//   },
//   checkboxHours: {
//     backgroundColor: "#FEF3C7",
//     borderColor: "#F59E0B",
//   },
//   checkboxLate: {
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

export default function WorkingHoursReport() {
  const { token } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const [summary, setSummary] = useState({
    totalPresentDays: 0,
    averageWorkingHours: 0,
    lateCount: 0,
  });

  useEffect(() => {
    fetchWorkingHours();
  }, [month]); // ✅ refetch on month change

  const getDateRange = (month) => {
    const [y, m] = month.split("-");
    const start = `${y}-${m}-01`;
    const end = `${y}-${m}-${new Date(y, m, 0).getDate()}`;
    return { start, end };
  };

  const fetchWorkingHours = async () => {
    try {
      setLoading(true);

      const { start, end } = getDateRange(month);

      const res = await axios.get(
        `${API_BASE_URL}/reports/working-hours`,
        {
          params: {
            fromDate: start,
            toDate: end,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSummary(res.data.summary);

    } catch (err) {
      console.error("Working hours fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ["Average Working Hours"],
    datasets: [{ data: [summary.averageWorkingHours] }],
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

        <Text style={styles.title}>Working Hours Report</Text>

        {/* ✅ MONTH PICKER */}
        <MonthPicker month={month} onChange={setMonth} />

        {/* Checkbox Style Cards */}
        <View style={styles.listContainer}>
          <Card label="Days Worked" value={summary.totalPresentDays} status="days" number={1} />
          <Card label="Avg Hours/Day" value={`${summary.averageWorkingHours}h`} status="hours" number={2} />
          <Card label="Late Arrivals" value={summary.lateCount} status="late" number={3} />
        </View>

        {/* Chart Container */}
        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            width={screenWidth - 32}
            height={240}
            yAxisSuffix="h"
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
      case "days":
        return [styles.checkbox, styles.checkboxDays];
      case "hours":
        return [styles.checkbox, styles.checkboxHours];
      case "late":
        return [styles.checkbox, styles.checkboxLate];
      default:
        return [styles.checkbox];
    }
  };

  const getCheckboxText = () => {
    switch (status) {
      case "days":
        return "📅";
      case "hours":
        return "⏰";
      case "late":
        return "⏱️";
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
  checkboxDays: {
    backgroundColor: "#DBEAFE",
    borderColor: "#3B82F6",
  },
  checkboxHours: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
  },
  checkboxLate: {
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
