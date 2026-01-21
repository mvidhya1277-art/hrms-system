import { View, Text, Button } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "../../../../constants/api";
import { useAuthStore } from "../../../../store/authStore";
import * as Linking from "expo-linking";

export default function Payslip() {
  const { payrollId } = useLocalSearchParams();
  const { token } = useAuthStore();
  const [payslip, setPayslip] = useState(null);

  useEffect(() => {
    fetchPayslip();
  }, []);

  const fetchPayslip = async () => {
    const res = await axios.get(
      `${API_BASE_URL}/payslip/${payrollId}/payslip`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPayslip(res.data);
  };

  if (!payslip) return <Text>Loading...</Text>;

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18 }}>Payslip</Text>

      <Text>Employee: {payslip.employee.name}</Text>
      <Text>Month: {payslip.company.month}</Text>

      <Text style={{ marginTop: 10 }}>Salary</Text>
      <Text>Basic: ₹{payslip.salary.basicSalary}</Text>
      <Text>Deductions: ₹{payslip.salary.deductions}</Text>
      <Text>Net: ₹{payslip.salary.netSalary}</Text>

      <Button
        title="Download PDF"
        onPress={() =>
          Linking.openURL(
            `${API_BASE_URL}/payslip/${payrollId}/payslip/pdf?token=${token}`
          )
        }
      />
    </View>
  );
}

// import { View, Text, Button } from "react-native";
// import { useLocalSearchParams } from "expo-router";
// import { API_BASE_URL } from "../../../constants/api";
// import { useAuthStore } from "../../../store/authStore";
// import * as Linking from "expo-linking";

// export default function Payslip() {
//   const { payrollId } = useLocalSearchParams();
//   const { token } = useAuthStore();

//   const downloadPDF = () => {
//     const url =
//       `${API_BASE_URL}/payroll/${payrollId}/payslip/pdf?token=${token}`;

//     Linking.openURL(url);
//   };

//   return (
//     <View style={{ padding: 16 }}>
//       <Text style={{ fontSize: 18, marginBottom: 20 }}>
//         Payslip
//       </Text>

//       <Button title="Download PDF" onPress={downloadPDF} />
//     </View>
//   );
// }
