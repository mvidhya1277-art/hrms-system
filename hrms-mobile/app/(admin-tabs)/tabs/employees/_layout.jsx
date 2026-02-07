import { Stack ,useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

export default function EmployeesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="calendar" options={{ headerShown: false }} />
      <Stack.Screen name="list" options={{ headerShown: false }}/>
      <Stack.Screen name="payroll" options={{  headerShown: false }} />
      <Stack.Screen name="all-payrolls" options={{  headerShown: false }} />
      <Stack.Screen name="payslip" options={{ headerShown: false }} />
    </Stack>
  );
}



