import {
    View,
    Text,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useState } from "react";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { useAuthStore } from "../store/authStore";
import { API_BASE_URL } from "../constants/api";
import { useRouter } from "expo-router";

/* ---------- HELPER: generate all months ---------- */
const generateMonthOptions = (startYear = 2025, endYear = 2100) => {
    const months = [];
    for (let y = startYear; y <= endYear; y++) {
        for (let m = 1; m <= 12; m++) {
            const value = `${y}-${String(m).padStart(2, "0")}`;
            const label = new Date(y, m - 1).toLocaleString("default", {
                month: "long",
                year: "numeric",
            });
            months.push({ label, value });
        }
    }
    return months;
};

export default function BulkPayroll() {
    const { token } = useAuthStore();
    const router = useRouter();
    const [payrollMonth, setPayrollMonth] = useState(
        new Date().toISOString().slice(0, 7)
    );
    const [loading, setLoading] = useState(false);

    const monthOptions = generateMonthOptions(2025, 2100);

    const handleBulkPayroll = async () => {
        try {
            setLoading(true);

            const res = await axios.post(
                `${API_BASE_URL}/payroll/generate-bulk`,
                { month: payrollMonth },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Alert.alert(
                "Success",
                res.data.message || "Bulk payroll generated successfully"
            );
        } catch (err) {
            Alert.alert(
                "Error",
                err.response?.data?.message || "Bulk payroll failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ padding: 16 }}>
            <View style={styles.card}>
                <Text style={styles.title}>Bulk Payroll</Text>

                <Text style={styles.label}>Select Month</Text>

                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={payrollMonth}
                        onValueChange={setPayrollMonth}
                    >
                        {monthOptions.map((m) => (
                            <Picker.Item
                                key={m.value}
                                label={m.label}
                                value={m.value}
                            />
                        ))}
                    </Picker>
                </View>

                <TouchableOpacity
                    style={[
                        styles.button,
                        loading && { opacity: 0.7 },
                    ]}
                    onPress={handleBulkPayroll}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "GENERATING..." : "GENERATE PAYROLL"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        marginTop: 12,
                        borderWidth: 1,
                        borderColor: "#e74c3c",
                        paddingVertical: 14,
                        borderRadius: 12,
                        alignItems: "center",
                    }}
                    onPress={() =>
                        router.push({
                            pathname: "/tabs/employees/all-payrolls",
                            params: { month: payrollMonth },
                        })
                    }
                >
                    <Text
                        style={{
                            color: "#e74c3c",
                            fontWeight: "700",
                            fontSize: 15,
                        }}
                    >
                        VIEW GENERATED PAYROLLS
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

/* ---------- STYLES ---------- */
const styles = {
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        elevation: 3,
        alignSelf: "center",
        width: "100%",
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
        color: "#334155",
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 10,
        marginBottom: 20,
        overflow: "hidden",
    },
    button: {
        backgroundColor: "#e74c3c",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
    },
};
