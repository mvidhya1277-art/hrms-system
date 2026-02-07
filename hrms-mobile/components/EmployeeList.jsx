import { FlatList, Text, TouchableOpacity, View, Alert } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { API_BASE_URL } from "../constants/api";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


export default function EmployeeList() {
    const { token } = useAuthStore();
    const router = useRouter();
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/admin/employees`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setEmployees(res.data));
    }, []);

    const deleteEmployee = (id) => {//render
        Alert.alert(
            "Delete Employee",
            "Are you sure you want to delete this employee?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await axios.delete(`${API_BASE_URL}/employees/${id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });

                            // remove from UI
                            setEmployees((prev) => prev.filter((e) => e._id !== id));
                        } catch (err) {
                            Alert.alert(
                                "Error",
                                err.response?.data?.message || "Delete failed"
                            );
                        }
                    },
                },
            ]
        );
    };


    return (
        <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
            <FlatList
                data={employees}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ paddingVertical: 8 }}
                renderItem={({ item }) => (
                    <View
                        style={{
                            backgroundColor: "#fff",
                            padding: 16,
                            borderRadius: 16,
                            marginBottom: 14,
                            flexDirection: "row",
                            alignItems: "center",
                            shadowColor: "#000",
                            shadowOpacity: 0.08,
                            shadowRadius: 6,
                            elevation: 3,
                        }}
                    >
                        {/* Avatar */}
                        <View
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: "#e74c3c",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 14,
                            }}
                        >
                            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
                                {item.name[0]}
                            </Text>
                        </View>

                        {/* Name + Code */}
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: "600", color: "#111" }}>
                                {item.name}
                            </Text>
                            <Text style={{ color: "#6b7280", fontSize: 13 }}>
                                {item.empCode}
                            </Text>
                        </View>

                        {/* Actions */}
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity
                                onPress={() =>
                                    router.push({
                                        pathname: "/tabs/employees/calendar",
                                        params: {
                                            employeeId: item._id,
                                            employeeName: item.name,
                                        },
                                    })
                                }
                                style={{
                                    backgroundColor: "#2563eb",
                                    paddingHorizontal: 14,
                                    paddingVertical: 6,
                                    borderRadius: 20,
                                    marginRight: 10,
                                }}
                            >
                                <Text style={{ color: "#fff", fontWeight: "600" }}>View</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => deleteEmployee(item._id)}
                                style={{
                                    backgroundColor: "#fee2e2",
                                    padding: 8,
                                    borderRadius: 20,
                                }}
                            >
                                <Ionicons name="trash-outline" size={18} color="#dc2626" />
                            </TouchableOpacity>
                        </View>
                    </View>

                )}

            />
            <TouchableOpacity
                onPress={() => router.push("/tabs/employees/trash")}
                style={{
                    backgroundColor: "#1f2933",
                    margin: 12,
                    paddingVertical: 10,
                    borderRadius: 10,
                    alignItems: "center",
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="trash-bin" size={18} color="#fff" />
                    <Text style={{ color: "#fff", fontWeight: "600", marginLeft: 8 }}>
                        View Deleted Employees
                    </Text>
                </View>
            </TouchableOpacity>

        </View>
    );
}
