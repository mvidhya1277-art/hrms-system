// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     Alert,
//     StyleSheet,
//     ScrollView,
//     KeyboardAvoidingView,
//     Platform
// } from "react-native";
// import { useEffect, useState } from "react";
// import { useRouter, useNavigation } from "expo-router";
// import { DrawerActions } from "@react-navigation/native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import axios from "axios";
// import { Ionicons } from "@expo/vector-icons";

// import { useAuthStore } from "../../../store/authStore";
// import { API_BASE_URL } from "../../../constants/api";
// import DashboardHeader from "../../../components/DashboardHeader";

// export default function AccountProfile() {
//     const navigation = useNavigation();
//     const { token } = useAuthStore();

//     /* ---------------- STATE ---------------- */
//     const [name, setName] = useState("");
//     const [phone, setPhone] = useState("");

//     const [isEditingProfile, setIsEditingProfile] = useState(false);

//     const [currentPassword, setCurrentPassword] = useState("");
//     const [newPassword, setNewPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");

//     const [showCurrentPwd, setShowCurrentPwd] = useState(false);
//     const [showNewPwd, setShowNewPwd] = useState(false);
//     const [showConfirmPwd, setShowConfirmPwd] = useState(false);

//     const [loading, setLoading] = useState(false);

//     /* ---------------- FETCH PROFILE ---------------- */
//     useEffect(() => {
//         fetchProfile();
//     }, []);

//     const fetchProfile = async () => {
//         try {
//             const res = await axios.get(`${API_BASE_URL}/settings/me`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             setName(res.data.name);
//             setPhone(res.data.phone);
//         } catch {
//             Alert.alert("Error", "Failed to load profile");
//         }
//     };

//     /* ---------------- UPDATE PROFILE ---------------- */
//     const updateProfile = async () => {
//         try {
//             setLoading(true);
//             await axios.put(
//                 `${API_BASE_URL}/settings/profile`,
//                 { name, phone },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             Alert.alert("Success", "Profile updated");
//             setIsEditingProfile(false);
//         } catch (err) {
//             Alert.alert("Error", err.response?.data?.message || "Update failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getPasswordStrength = (password) => {
//         if (!password) return { label: "", color: "#e5e7eb" };

//         const hasNumber = /\d/.test(password);
//         const hasSpecial = /[^A-Za-z0-9]/.test(password);

//         if (password.length >= 8 && hasNumber && hasSpecial) {
//             return { label: "Strong", color: "#22c55e" };
//         }

//         if (password.length >= 6 && hasNumber) {
//             return { label: "Medium", color: "#facc15" };
//         }

//         return { label: "Weak", color: "#ef4444" };
//     };

//     const passwordStrength = getPasswordStrength(newPassword);

//     /* ---------------- CHANGE PASSWORD ---------------- */
//     const changePassword = async () => {
//         if (!currentPassword || !newPassword || !confirmPassword) {
//             return Alert.alert("Validation", "All password fields required");
//         }

//         if (newPassword !== confirmPassword) {
//             return Alert.alert("Validation", "Passwords do not match");
//         }

//         try {
//             setLoading(true);
//             await axios.put(
//                 `${API_BASE_URL}/settings/change-password`,
//                 { currentPassword, newPassword },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             Alert.alert("Success", "Password changed");
//             setCurrentPassword("");
//             setNewPassword("");
//             setConfirmPassword("");
//         } catch (err) {
//             Alert.alert("Error", err.response?.data?.message || "Failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <View style={styles.screen}>

//             {/* HEADER */}
//             <SafeAreaView edges={["top"]} style={styles.headerSafe}>
//                 <DashboardHeader
//                     title="Account & Profile"
//                     onMenuPress={() =>
//                         navigation.dispatch(DrawerActions.openDrawer())
//                     }
//                 />
//             </SafeAreaView>

//             <ScrollView
//                 keyboardShouldPersistTaps="handled"
//                 showsVerticalScrollIndicator={false}
//                 contentContainerStyle={{
//                     padding: 16,
//                     paddingBottom: 200, 
//                     flexGrow: 1,  // 🔥 CRITICAL
//                 }}
//             >
//                 {/* PROFILE CARD */}
//                 <View style={styles.card}>
//                     <View style={styles.cardHeader}>
//                         <Text style={styles.cardTitle}>Profile Information</Text>
//                         <TouchableOpacity onPress={() => setIsEditingProfile(!isEditingProfile)}>
//                             <Ionicons name="pencil" size={18} color="#ef4444" />
//                         </TouchableOpacity>
//                     </View>

//                     <TextInput
//                         style={[styles.input, !isEditingProfile && styles.disabledInput]}
//                         value={name}
//                         editable={isEditingProfile}
//                         onChangeText={setName}
//                     />

//                     <TextInput
//                         style={[styles.input, !isEditingProfile && styles.disabledInput]}
//                         value={phone}
//                         editable={isEditingProfile}
//                         onChangeText={setPhone}
//                         keyboardType="phone-pad"
//                     />

//                     {isEditingProfile && (
//                         <TouchableOpacity
//                             style={styles.primaryBtn}
//                             onPress={updateProfile}
//                             disabled={loading}
//                         >
//                             <Text style={styles.primaryText}>Save Profile</Text>
//                         </TouchableOpacity>
//                     )}
//                 </View>

//                 {/* PASSWORD CARD */}
//                 {/* PASSWORD CARD */}
//                 <View style={styles.card}>
//                     <Text style={styles.cardTitle}>Change Password</Text>

//                     {/* Current Password */}
//                     <View style={styles.passwordRow}>
//                         <TextInput
//                             style={styles.passwordInput}
//                             placeholder="Current Password"
//                             secureTextEntry={!showCurrentPwd}
//                             value={currentPassword}
//                             onChangeText={setCurrentPassword}
//                         />
//                         <TouchableOpacity onPress={() => setShowCurrentPwd(!showCurrentPwd)}>
//                             <Ionicons
//                                 name={showCurrentPwd ? "eye-off" : "eye"}
//                                 size={20}
//                                 color="#6b7280"
//                             />
//                         </TouchableOpacity>
//                     </View>

//                     {/* New Password */}
//                     <View style={styles.passwordRow}>
//                         <TextInput
//                             style={styles.passwordInput}
//                             placeholder="New Password"
//                             secureTextEntry={!showNewPwd}
//                             value={newPassword}
//                             onChangeText={setNewPassword}
//                         />
//                         <TouchableOpacity onPress={() => setShowNewPwd(!showNewPwd)}>
//                             <Ionicons
//                                 name={showNewPwd ? "eye-off" : "eye"}
//                                 size={20}
//                                 color="#6b7280"
//                             />
//                         </TouchableOpacity>
//                     </View>

//                     {/* Password Strength */}
//                     {newPassword.length > 0 && (
//                         <View style={{ marginBottom: 12 }}>
//                             <View
//                                 style={{
//                                     height: 6,
//                                     borderRadius: 4,
//                                     backgroundColor: passwordStrength.color,
//                                     marginBottom: 4,
//                                 }}
//                             />
//                             <Text
//                                 style={{
//                                     fontSize: 12,
//                                     fontWeight: "600",
//                                     color: passwordStrength.color,
//                                 }}
//                             >
//                                 Password strength: {passwordStrength.label}
//                             </Text>
//                         </View>
//                     )}

//                     {/* Confirm Password */}
//                     <View style={styles.passwordRow}>
//                         <TextInput
//                             style={styles.passwordInput}
//                             placeholder="Confirm New Password"
//                             secureTextEntry={!showConfirmPwd}
//                             value={confirmPassword}
//                             onChangeText={setConfirmPassword}
//                         />
//                         <TouchableOpacity onPress={() => setShowConfirmPwd(!showConfirmPwd)}>
//                             <Ionicons
//                                 name={showConfirmPwd ? "eye-off" : "eye"}
//                                 size={20}
//                                 color="#6b7280"
//                             />
//                         </TouchableOpacity>
//                     </View>

//                     {/* Submit */}
//                     <TouchableOpacity
//                         style={[
//                             styles.primaryBtn,
//                             passwordStrength.label === "Weak" && { opacity: 0.6 },
//                         ]}
//                         onPress={changePassword}
//                         disabled={loading || passwordStrength.label === "Weak"}
//                     >
//                         <Text style={styles.primaryText}>Change Password</Text>
//                     </TouchableOpacity>
//                 </View>

//             </ScrollView>
//         </View>
//     );
// }

// /* ---------------- STYLES ---------------- */

// const styles = StyleSheet.create({
//     screen: { flex: 1, backgroundColor: "#f5f6fa" },
//     headerSafe: { backgroundColor: "#f5f6fa" },
//     // content: { padding: 16 },

//     card: {
//         backgroundColor: "#fff",
//         borderRadius: 16,
//         padding: 16,
//         marginBottom: 16,
//         elevation: 3,
//     },

//     cardHeader: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: 12,
//     },

//     cardTitle: {
//         fontSize: 16,
//         fontWeight: "700",
//         color: "#0f172a",
//     },

//     input: {
//         borderWidth: 1,
//         borderColor: "#e5e7eb",
//         borderRadius: 12,
//         padding: 12,
//         marginBottom: 12,
//         backgroundColor: "#f9fafb",
//     },

//     disabledInput: {
//         backgroundColor: "#f1f5f9",
//         color: "#64748b",
//     },

//     passwordRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         borderWidth: 1,
//         borderColor: "#e5e7eb",
//         borderRadius: 12,
//         paddingHorizontal: 12,
//         marginBottom: 12,
//         backgroundColor: "#f9fafb",
//     },

//     passwordInput: {
//         flex: 1,
//         paddingVertical: 12,
//     },

//     primaryBtn: {
//         backgroundColor: "#ef4444",
//         padding: 14,
//         borderRadius: 12,
//         alignItems: "center",
//         marginTop: 6,
//     },

//     primaryText: {
//         color: "#fff",
//         fontWeight: "700",
//     },
// });

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
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

import { useAuthStore } from "../../../store/authStore";
import { API_BASE_URL } from "../../../constants/api";
import DashboardHeader from "../../../components/DashboardHeader";

export default function AccountProfile() {
    const navigation = useNavigation();
    const { token } = useAuthStore();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPwd, setShowCurrentPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);
    const [showConfirmPwd, setShowConfirmPwd] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/settings/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setName(res.data.name);
            setPhone(res.data.phone);
        } catch {
            Alert.alert("Error", "Failed to load profile");
        }
    };

    const updateProfile = async () => {
        try {
            await axios.put(
                `${API_BASE_URL}/settings/profile`,
                { name, phone },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert("Success", "Profile updated");
            setIsEditingProfile(false);
        } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "Update failed");
        }
    };

    const passwordStrength = (() => {
        if (!newPassword) return null;
        if (newPassword.length >= 8 && /\d/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword))
            return { label: "Strong", color: "#22c55e" };
        if (newPassword.length >= 6 && /\d/.test(newPassword))
            return { label: "Medium", color: "#facc15" };
        return { label: "Weak", color: "#ef4444" };
    })();

    const changePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword)
            return Alert.alert("Validation", "All fields required");

        if (newPassword !== confirmPassword)
            return Alert.alert("Validation", "Passwords do not match");

        try {
            await axios.put(
                `${API_BASE_URL}/settings/change-password`,
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert("Success", "Password changed");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "Failed");
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
                    padding: 0,
                    paddingBottom: 320,
                    flexGrow: 1,   // ✅ REQUIRED
                }}
            >
                <SafeAreaView edges={["top"]}>
                    <DashboardHeader
                        title="Account & Profile"
                        onMenuPress={() =>
                            navigation.dispatch(DrawerActions.openDrawer())
                        }
                    />
                </SafeAreaView>

                {/* PROFILE */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Profile Information</Text>
                        <TouchableOpacity onPress={() => setIsEditingProfile(!isEditingProfile)}>
                            <Ionicons name="pencil" size={18} color="#ef4444" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={[styles.input, !isEditingProfile && styles.disabled]}
                        value={name}
                        editable={isEditingProfile}
                        onChangeText={setName}
                    />

                    <TextInput
                        style={[styles.input, !isEditingProfile && styles.disabled]}
                        value={phone}
                        editable={isEditingProfile}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />

                    {isEditingProfile && (
                        <TouchableOpacity style={styles.btn} onPress={updateProfile}>
                            <Text style={styles.btnText}>Save Profile</Text>
                        </TouchableOpacity>
                    )}
                </View>
                {/* PASSWORD */}
                <View style={[styles.card, { flex: 1 }]}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Change Password</Text>
                    </View>

                    <PasswordInput
                        placeholder="Current Password"
                        value={currentPassword}
                        setValue={setCurrentPassword}
                        show={showCurrentPwd}
                        setShow={setShowCurrentPwd}
                    />

                    <PasswordInput
                        placeholder="New Password"
                        value={newPassword}
                        setValue={setNewPassword}
                        show={showNewPwd}
                        setShow={setShowNewPwd}
                    />

                    {passwordStrength && (
                        <Text style={{ color: passwordStrength.color, fontWeight: "600" }}>
                            Strength: {passwordStrength.label}
                        </Text>
                    )}

                    <PasswordInput
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        setValue={setConfirmPassword}
                        show={showConfirmPwd}
                        setShow={setShowConfirmPwd}
                    />

                    <TouchableOpacity
                        style={[
                            styles.btn,
                            passwordStrength?.label === "Weak" && { opacity: 0.6 },
                        ]}
                        onPress={changePassword}
                        disabled={passwordStrength?.label === "Weak"}
                    >
                        <Text style={styles.btnText}>Change Password</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

/* -------- PASSWORD INPUT -------- */
function PasswordInput({ placeholder, value, setValue, show, setShow }) {
    return (
        <View style={styles.passwordRow}>
            <TextInput
                style={{ flex: 1, paddingVertical: 12 }}
                placeholder={placeholder}
                secureTextEntry={!show}
                value={value}
                onChangeText={setValue}
            />
            <TouchableOpacity onPress={() => setShow(!show)}>
                <Ionicons name={show ? "eye-off" : "eye"} size={20} color="#6b7280" />
            </TouchableOpacity>
        </View>
    );
}

/* -------- STYLES -------- */
const styles = {
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        margin: 16,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "700",
    },
    input: {
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
    },
    disabled: {
        backgroundColor: "#f1f5f9",
        color: "#64748b",
    },
    passwordRow: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 12,
    },
    btn: {
        backgroundColor: "#ef4444",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
    },
    btnText: {
        color: "#fff",
        fontWeight: "700",
    },
};


