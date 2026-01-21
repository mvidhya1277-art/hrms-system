import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import EmployeeList from "../../../../components/EmployeeList";
import CreateEmployee from "../../../../components/CreateEmployee";
import BulkPayroll from "../../../../components/BulkPayroll";
import { useNavigation } from "expo-router";

export default function EmployeesIndex() {
  const [activeTab, setActiveTab] = useState("list");
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
      

        <Text style={{ fontSize: 22, fontWeight: "bold", marginVertical: 12 }}>
          Employee Management
        </Text>

        {/* TOP TABS */}
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#f1f5f9",
              borderRadius: 16,
              padding: 6,
              width: "90%",
            }}
          >
            <TabButton
              label="Employee List"
              active={activeTab === "list"}
              onPress={() => setActiveTab("list")}
            />
            <TabButton
              label="Create Employee"
              active={activeTab === "create"}
              onPress={() => setActiveTab("create")}
            />
            <TabButton
              label="Bulk Payroll"
              active={activeTab === "payroll"}
              onPress={() => setActiveTab("payroll")}
            />
          </View>
        </View>
      </View>

      {/* TAB CONTENT */}
      <View style={{ flex: 1 }}>
        {activeTab === "list" && <EmployeeList />}
        {activeTab === "create" && <CreateEmployee />}
        {activeTab === "payroll" && <BulkPayroll />}
      </View>
    </View>
  );
}

/* ---------- TAB BUTTON ---------- */
function TabButton({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        minHeight: 48,
        paddingHorizontal: 6,
        borderRadius: 12,
        backgroundColor: active ? "#ffffff" : "transparent",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 4,
      }}
    >
      <Text
        numberOfLines={2}
        style={{
          fontWeight: "700",
          color: active ? "#e74c3c" : "#64748b",
          fontSize: 13,
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}





