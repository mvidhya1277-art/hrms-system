// import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { PieChart } from "react-native-chart-kit";
// import { useEffect, useState } from "react";
// import axios from "axios";

// import { chartConfig, screenWidth } from "../../../constants/chartConfig";
// import { API_BASE_URL } from "../../../constants/api";
// import { useAuthStore } from "../../../store/authStore";
// import MonthPicker from "../../../components/MonthPicker";


// export default function AttendanceReport() {
//   const { token } = useAuthStore();

//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     present: 0,
//     absent: 0,
//     late: 0,
//   });

//   const [month, setMonth] = useState(
//   new Date().toISOString().slice(0, 7)
// );

// const getDateRange = (month) => {
//   const [y, m] = month.split("-");
//   const start = `${y}-${m}-01`;
//   const end = `${y}-${m}-${new Date(y, m, 0).getDate()}`;
//   return { start, end };
// };

// const { start, end } = getDateRange(month);


//   useEffect(() => {
//     fetchAttendance();
//   }, []);

//   const fetchAttendance = async () => {
//     try {
//       const res = await axios.get(
//         `${API_BASE_URL}/reports/attendance`,
//         {
//           headers: {
//             params: { fromDate: start, toDate: end },
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const summary = res.data.summary;

//       setStats({
//         present: summary.presentCount || 0,
//         absent: summary.absentCount || 0,
//         late: summary.lateCount || 0,
//       });

//     } catch (err) {
//       console.error("Attendance fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const chartData = [
//     { name: "Present", population: stats.present, color: "#22C55E", legendFontColor: "#374151" },
//     { name: "Absent", population: stats.absent, color: "#EF4444", legendFontColor: "#374151" },
//     { name: "Late", population: stats.late, color: "#F59E0B", legendFontColor: "#374151" },
//   ];

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

//         <Text style={styles.title}>Attendance Report</Text>

//         {/* Summary Cards with Checkbox Style */}
//         <View style={styles.listContainer}>
//           <Card label="Present" value={stats.present} status="present" />
//           <Card label="Absent" value={stats.absent} status="absent" />
//           <Card label="Late" value={stats.late} status="late" />
//         </View>

//         {/* Chart */}
//         <View style={styles.chartContainer}>
//           <PieChart
//             data={chartData}
//             width={screenWidth - 32}
//             height={220}
//             chartConfig={chartConfig}
//             accessor="population"
//             backgroundColor="transparent"
//             paddingLeft="16"
//             absolute
//             hasLegend={true}
//             center={[10, 0]}
//             avoidFalseZero={true}
//           />
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const Card = ({ label, value, status }) => {
//   // Get checkbox style based on status
//   const getCheckboxStyle = () => {
//     switch(status) {
//       case 'present':
//         return [styles.checkbox, styles.checkboxPresent];
//       case 'absent':
//         return [styles.checkbox, styles.checkboxAbsent];
//       case 'late':
//         return [styles.checkbox, styles.checkboxLate];
//       default:
//         return [styles.checkbox];
//     }
//   };

//   // Get checkbox text based on status
//   const getCheckboxText = () => {
//     switch(status) {
//       case 'present':
//         return "✓";
//       case 'absent':
//         return "✗";
//       case 'late':
//         return "…";
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
//         <Text style={styles.cardLabel}>({status === 'present' ? '1' : status === 'absent' ? '2' : '3'}) {label}</Text>
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
//   checkboxPresent: {
//     backgroundColor: "#DCFCE7",
//     borderColor: "#22C55E",
//   },
//   checkboxAbsent: {
//     backgroundColor: "#FEE2E2",
//     borderColor: "#EF4444",
//   },
//   checkboxLate: {
//     backgroundColor: "#FEF3C7",
//     borderColor: "#F59E0B",
//   },
//   checkboxText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: "#1F2937"
//   },
//   cardLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: "#374151"
//   },
//   cardValue: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: "#1F2937"
//   }
// });

import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart } from "react-native-chart-kit";
import { useEffect, useState } from "react";
import axios from "axios";

import { chartConfig, screenWidth } from "../../../constants/chartConfig";
import { API_BASE_URL } from "../../../constants/api";
import { useAuthStore } from "../../../store/authStore";
import MonthPicker from "../../../components/MonthPicker";

export default function AttendanceReport() {
  const { token } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0 });

  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const getDateRange = (month) => {
    const [y, m] = month.split("-");
    return {
      start: `${y}-${m}-01`,
      end: `${y}-${m}-${new Date(y, m, 0).getDate()}`
    };
  };

  useEffect(() => {
    fetchAttendance();
  }, [month]); // ✅ re-fetch on month change

  const fetchAttendance = async () => {
    try {
      setLoading(true); // ✅ reset loader

      const { start, end } = getDateRange(month);

      const res = await axios.get(
        `${API_BASE_URL}/reports/attendance`,
        {
          params: { fromDate: start, toDate: end }, // ✅ CORRECT
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const summary = res.data.summary;

      setStats({
        present: summary.presentCount || 0,
        absent: summary.absentCount || 0,
        late: summary.lateCount || 0,
      });

    } catch (err) {
      console.error("Attendance fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: "Present", population: stats.present, color: "#22C55E", legendFontColor: "#374151" },
    { name: "Absent", population: stats.absent, color: "#EF4444", legendFontColor: "#374151" },
    { name: "Late", population: stats.late, color: "#F59E0B", legendFontColor: "#374151" },
  ];

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

        <Text style={styles.title}>Attendance Report</Text>

        {/* ✅ MONTH PICKER */}
        <MonthPicker month={month} onChange={setMonth} />

        {/* Summary Cards */}
        <View style={styles.listContainer}>
          <Card label="Present" value={stats.present} status="present" />
          <Card label="Absent" value={stats.absent} status="absent" />
          <Card label="Late" value={stats.late} status="late" />
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <PieChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="12"
            absolute
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- CARD ---------- */

const Card = ({ label, value, status }) => {
  const map = {
    present: { bg: "#DCFCE7", border: "#22C55E", text: "✓", index: "1" },
    absent: { bg: "#FEE2E2", border: "#EF4444", text: "✗", index: "2" },
    late: { bg: "#FEF3C7", border: "#F59E0B", text: "…", index: "3" },
  };

  const s = map[status];

  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={[styles.checkbox, { backgroundColor: s.bg, borderColor: s.border }]}>
          <Text style={styles.checkboxText}>{s.text}</Text>
        </View>
        <Text style={styles.cardLabel}>({s.index}) {label}</Text>
      </View>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
};

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F5F7FB" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  listContainer: { marginBottom: 24 },
  chartContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxText: { fontWeight: "700" },
  cardLabel: { fontSize: 16, fontWeight: "600" },
  cardValue: { fontSize: 20, fontWeight: "700" },
});



