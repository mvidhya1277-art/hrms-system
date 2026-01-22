// import { Drawer } from "expo-router/drawer";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import AdminDrawerContent from "../../components/AdminDrawerContent";

// export default function Layout() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <Drawer
//         screenOptions={{
//           headerShown: false,
//           drawerStyle: {
//             width: 280,
//             backgroundColor: "#243447",
//           },
//         }}
//         drawerContent={(props) => <AdminDrawerContent {...props} />}
//       >
//         {/* Only one entry – tabs */}
//         <Drawer.Screen name="tabs" /> 
//       </Drawer>
//     </GestureHandlerRootView>
//   );
// }

import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AdminDrawerContent from "../../components/AdminDrawerContent";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: true, // ✅ SHOW HEADER
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTitleStyle: {
            fontWeight: "700",
          },
          drawerStyle: {
            width: 280,
            backgroundColor: "#243447",
          },
        }}
        drawerContent={(props) => <AdminDrawerContent {...props} />}
      >
        {/* Bottom Tabs */}
        <Drawer.Screen
          name="tabs"
          options={{
            headerShown: false, 
          }}
        />

        {/* Reports (NOT a tab, but still inside drawer) */}
        <Drawer.Screen
          name="reports"
          options={{
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

