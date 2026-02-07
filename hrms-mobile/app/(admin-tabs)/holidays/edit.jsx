import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Modal,
    Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../../store/authStore";
import { API_BASE_URL } from "../../../constants/api";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

/* format as DD/MM/YYYY */
const formatDate = (d) => {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

export default function EditHoliday() {
    const { id, name: oldName, date: oldDate } = useLocalSearchParams();
    const router = useRouter();
    const { token } = useAuthStore();

    const [name, setName] = useState(oldName || "");
    const normalizeIncomingDate = (d) => {
        if (!d) return "";
        if (d.includes("/")) return d; // already formatted
        const parsed = new Date(d);
        if (isNaN(parsed)) return "";
        return formatDate(parsed);
    };

    const [date, setDate] = useState(normalizeIncomingDate(oldDate));
    const [showPicker, setShowPicker] = useState(false);

    const submit = async () => {
        if (!name || !date) {
            Alert.alert("Validation", "Name and date required");
            return;
        }

        try {
            await axios.put(
                `${API_BASE_URL}/holidays/${id}`,
                { name, date },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Alert.alert("Updated", "Holiday updated successfully");
            router.back();
        } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "Update failed");
        }
    };

    return (
        <Modal transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalCard}>
                    {/* HEADER */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Edit Holiday</Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="close" size={22} color="#ef4444" />
                        </TouchableOpacity>
                    </View>

                    {/* FORM */}
                    <Text style={styles.label}>Holiday Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        placeholder="Holiday Name"
                    />

                    <Text style={styles.label}>Date</Text>
                    <TouchableOpacity
                        style={styles.inputWithIcon}
                        onPress={() => setShowPicker(true)}
                    >
                        <Text style={{ color: date ? "#000" : "#9ca3af" }}>
                            {date || "DD/MM/YYYY"}
                        </Text>
                        <Ionicons name="calendar-outline" size={20} color="#9ca3af" />
                    </TouchableOpacity>

                    {showPicker && (
                        <DateTimePicker
                            value={
                                date
                                    ? new Date(date.split("/").reverse().join("-"))
                                    : new Date()
                            }
                            mode="date"
                            display={Platform.OS === "ios" ? "inline" : "default"}
                            onChange={(event, selectedDate) => {
                                setShowPicker(false);
                                if (selectedDate) {
                                    setDate(formatDate(selectedDate));
                                }
                            }}
                        />
                    )}

                    {/* ACTIONS */}
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.saveBtn} onPress={submit}>
                            <Ionicons name="save-outline" size={18} color="#fff" />
                            <Text style={styles.saveText}> Update</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="close" size={18} color="#0f172a" />
                            <Text style={styles.cancelText}> Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalCard: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    title: { fontSize: 18, fontWeight: "700" },
    label: {
        fontSize: 13,
        color: "#475569",
        marginBottom: 6,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        padding: 12,
        backgroundColor: "#f9fafb",
    },
    inputWithIcon: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: "#f9fafb",
        height: 46,
        justifyContent: "space-between",
    },
    actions: { flexDirection: "row", marginTop: 20, gap: 12 },
    saveBtn: {
        flex: 1,
        backgroundColor: "#ef4444",
        padding: 14,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    saveText: { color: "#fff", fontWeight: "600" },
    cancelBtn: {
        flex: 1,
        backgroundColor: "#f1f5f9",
        padding: 14,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    cancelText: { color: "#0f172a", fontWeight: "600" },
});
