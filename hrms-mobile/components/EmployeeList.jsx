import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { API_BASE_URL } from "../constants/api";
import { useRouter } from "expo-router";

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

    return (
        <FlatList
            data={employees}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item }) => (
                <View
                    style={{
                        backgroundColor: "#fff",
                        padding: 14,
                        borderRadius: 14,
                        marginBottom: 12,
                        flexDirection: "row",
                        alignItems: "center",

                        alignSelf: "center",   // 👈 KEY LINE
                        width: "100%",         // stays inside 90%
                    }}
                >

                    {/* AVATAR */}
                    <View
                        style={{
                            width: 42,
                            height: 42,
                            borderRadius: 21,
                            backgroundColor: "#e74c3c",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 12,
                        }}
                    >
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>
                            {item.name[0]}
                        </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: "600" }}>{item.name}</Text>
                        <Text style={{ color: "#64748b" }}>{item.empCode}</Text>
                    </View>

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
                    >
                        <Text style={{ color: "#2563eb" }}>View</Text>
                    </TouchableOpacity>
                </View>
            )}
        />
    );
}
