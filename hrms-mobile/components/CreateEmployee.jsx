// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     Alert,
//     ScrollView,KeyboardAvoidingView,Platform
// } from "react-native";
// import { useState } from "react";
// import axios from "axios";
// import { useAuthStore } from "../store/authStore";
// import { API_BASE_URL } from "../constants/api";

// export default function CreateEmployee() {
//     const { token } = useAuthStore();

//     const [name, setName] = useState("");
//     const [empCode, setEmpCode] = useState("");
//     const [phone, setPhone] = useState("");
//     const [password, setPassword] = useState("");
//     const [salary, setSalary] = useState("");
//     const [rfidUid, setRfidUid] = useState("");
//     const [loading, setLoading] = useState(false);

//     const handleCreateEmployee = async () => {
//         if (!name || !empCode || !phone || !password || !salary) {
//             Alert.alert("Error", "All required fields must be filled");
//             return;
//         }

//         try {
//             setLoading(true);

//             await axios.post(
//                 `${API_BASE_URL}/admin/employee`,
//                 {
//                     name,
//                     empCode,
//                     phone,
//                     password,
//                     salary: Number(salary),
//                     rfidUid: rfidUid || null,
//                 },
//                 {
//                     headers: { Authorization: `Bearer ${token}` },
//                 }
//             );

//             Alert.alert("Success", "Employee created successfully");

//             setName("");
//             setEmpCode("");
//             setPhone("");
//             setPassword("");
//             setSalary("");
//             setRfidUid("");
//         } catch (err) {
//             Alert.alert(
//                 "Error",
//                 err.response?.data?.message || "Failed to create employee"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
        
//         <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled"
//             showsVerticalScrollIndicator={false}>
                
//             <View style={styles.card}>
//                 <Text style={styles.sectionTitle}>Create Employee</Text>

//                 <Label text="Employee Name" />
//                 <TextInput
//                     placeholder="Enter employee name"
//                     value={name}
//                     onChangeText={setName}
//                     style={styles.input}
//                 />

//                 <Label text="Employee Code" />
//                 <TextInput
//                     placeholder="e.g. EMP001"
//                     value={empCode}
//                     onChangeText={setEmpCode}
//                     style={styles.input}
//                 />

//                 <Label text="Phone" />
//                 <TextInput
//                     placeholder="Enter phone number"
//                     value={phone}
//                     onChangeText={setPhone}
//                     keyboardType="phone-pad"
//                     style={styles.input}
//                 />

//                 <Label text="Password" />
//                 <TextInput
//                     placeholder="Create password"
//                     value={password}
//                     onChangeText={setPassword}
//                     secureTextEntry
//                     style={styles.input}
//                 />
//                 <Text style={styles.helper}>Minimum 8 characters</Text>

//                 <Label text="Salary (monthly)" />
//                 <TextInput
//                     placeholder="Enter monthly salary"
//                     value={salary}
//                     onChangeText={setSalary}
//                     keyboardType="numeric"
//                     style={styles.input}
//                 />

//                 <Label text="RFID UID (optional)" />
//                 <TextInput
//                     placeholder="Enter RFID UID if available"
//                     value={rfidUid}
//                     onChangeText={setRfidUid}
//                     style={styles.input}
//                 />
//                 <Text style={styles.helper}>
//                     For attendance system integration
//                 </Text>

//                 <TouchableOpacity
//                     style={[
//                         styles.button,
//                         loading && { opacity: 0.7 },
//                     ]}
//                     onPress={handleCreateEmployee}
//                     disabled={loading}
//                 >
//                     <Text style={styles.buttonText}>
//                         {loading ? "CREATING..." : "CREATE EMPLOYEE"}
//                     </Text>
//                 </TouchableOpacity>
//             </View>
            
//         </ScrollView>
        
//     );
// }

// /* ---------- SMALL REUSABLE LABEL ---------- */
// function Label({ text }) {
//     return <Text style={styles.label}>{text}</Text>;
// }

// /* ---------- STYLES ---------- */
// const styles = {
//     card: {
//         backgroundColor: "#fff",
//         borderRadius: 16,
//         padding: 16,
//         elevation: 3,
//         alignSelf: "center",
//         width: "100%",
//     },
//     sectionTitle: {
//         fontSize: 20,
//         fontWeight: "700",
//         marginBottom: 16,
//     },
//     label: {
//         fontSize: 13,
//         fontWeight: "600",
//         marginBottom: 6,
//         color: "#334155",
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: "#e2e8f0",
//         borderRadius: 10,
//         paddingHorizontal: 12,
//         paddingVertical: 10,
//         marginBottom: 12,
//         fontSize: 14,
//     },
//     helper: {
//         fontSize: 11,
//         color: "#64748b",
//         marginBottom: 12,
//         marginTop: -6,
//     },
//     button: {
//         backgroundColor: "#22c55e",
//         paddingVertical: 14,
//         borderRadius: 12,
//         alignItems: "center",
//         marginTop: 10,
//     },
//     buttonText: {
//         color: "#fff",
//         fontWeight: "700",
//         fontSize: 15,
//     },
// };










import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { API_BASE_URL } from "../constants/api";

export default function CreateEmployee() {
  const { token } = useAuthStore();

  const [name, setName] = useState("");
  const [empCode, setEmpCode] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [salary, setSalary] = useState("");
  const [rfidUid, setRfidUid] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateEmployee = async () => {
    if (!name || !empCode || !phone || !password || !salary) {
      Alert.alert("Error", "All required fields must be filled");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${API_BASE_URL}/admin/employee`,
        {
          name,
          empCode,
          phone,
          password,
          salary: Number(salary),
          rfidUid: rfidUid || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", "Employee created successfully");
      setName("");
      setEmpCode("");
      setPhone("");
      setPassword("");
      setSalary("");
      setRfidUid("");
    } catch (err) {
      Alert.alert("Error", "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 200,   // 🔥 CRITICAL
        }}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Create Employee</Text>

          <Input label="Employee Name" value={name} onChange={setName} />
          <Input label="Employee Code" value={empCode} onChange={setEmpCode} />
          <Input label="Phone" value={phone} onChange={setPhone} keyboard="phone-pad" />
          <Input label="Password" value={password} onChange={setPassword} secure />
          <Input label="Salary" value={salary} onChange={setSalary} keyboard="numeric" />
          <Input label="RFID UID (optional)" value={rfidUid} onChange={setRfidUid} />

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleCreateEmployee}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "CREATING..." : "CREATE EMPLOYEE"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ---------- INPUT ---------- */
function Input({ label, value, onChange, keyboard, secure }) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard}
        secureTextEntry={secure}
      />
    </>
  );
}

/* ---------- STYLES ---------- */
const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
};
