// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
// } from "react-native";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "../../../../constants/api";
// import { useAuthStore } from "../../../../store/authStore";
// import { useRouter } from "expo-router";

// export default function AdminPayrollList() {
//   const { token } = useAuthStore();
//   const router = useRouter();
//   const [payrolls, setPayrolls] = useState([]);

//   useEffect(() => {
//     fetchPayrolls();
//   }, []);

//   const fetchPayrolls = async () => {
//     try {
//       const res = await axios.get(
//         `${API_BASE_URL}/payroll/all`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPayrolls(res.data || []);
//     } catch (err) {
//       console.log("FETCH ALL PAYROLLS ERROR:", err.response?.data || err.message);
//     }
//   };

//   return (
//     <View style={{ padding: 16 }}>
//       <Text style={{ fontSize: 18, marginBottom: 10 }}>
//         All Payrolls
//       </Text>

//       <FlatList
//         data={payrolls}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             onPress={() =>
//               router.push({
//                 pathname: "/(admin-tabs)/tabs/employees/payslip",
//                 params: { payrollId: item._id },
//               })
//             }
//             style={{
//               padding: 12,
//               borderWidth: 1,
//               marginBottom: 8,
//               borderRadius: 6,
//             }}
//           >
//             <Text>{item.employeeName}</Text>
//             <Text>Month: {item.month}</Text>
//             <Text>Net Salary: ₹{item.netSalary}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../constants/api";
import { useAuthStore } from "../../../../store/authStore";
import { useRouter } from "expo-router";

export default function AdminPayrollList() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [payrolls, setPayrolls] = useState([]);

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/payroll/company`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPayrolls(res.data?.payrolls || []);
    } catch (err) {
      console.log("FETCH ALL PAYROLLS ERROR:", err.response?.data || err.message);
    }
  };

  const getColor = (amount) => (amount > 0 ? "#22c55e" : "#f59e0b");

  return (
    <View style={styles.page}>
      <Text style={styles.title}>All Payrolls</Text>

      <FlatList
        data={payrolls}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/(admin-tabs)/tabs/employees/payslip",
                params: { payrollId: item._id },
              })
            }
          >
            {/* Left color bar */}
            <View
              style={[
                styles.sideBar,
                { backgroundColor: getColor(item.netSalary) },
              ]}
            />

            {/* Left info */}
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.employeeName}</Text>

              <View style={styles.row}>
                <Text style={styles.icon}>📅</Text>
                <Text style={styles.sub}>Month: {item.month}</Text>
              </View>
            </View>

            {/* Right salary */}
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={[
                  styles.amount,
                  { color: getColor(item.netSalary) },
                ]}
              >
                ₹{item.netSalary}
              </Text>
              <Text style={styles.sub}>Net Salary</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 14,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
  },

  sideBar: {
    width: 4,
    height: "100%",
    borderRadius: 10,
    marginRight: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    marginRight: 4,
  },

  sub: {
    fontSize: 12,
    color: "#64748b",
  },

  amount: {
    fontSize: 18,
    fontWeight: "800",
  },
});
