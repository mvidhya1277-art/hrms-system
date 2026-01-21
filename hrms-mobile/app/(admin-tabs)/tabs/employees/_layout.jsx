import { Stack } from "expo-router";

export default function EmployeesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="calendar" options={{ headerShown: false }} />
      <Stack.Screen name="payroll" options={{ title: "Payroll" }} />
      <Stack.Screen name="payslip" options={{ title: "Payslip" }} />
    </Stack>
  );
}



