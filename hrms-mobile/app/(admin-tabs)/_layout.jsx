// import { Drawer } from "expo-router/drawer";
// import { GestureHandlerRootView } from "react-native-gesture-handler";

// export default function Layout() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <Drawer
//         screenOptions={{
//           headerShown: false,
//           drawerStyle: {
//             width: 260,
//           },
//         }}
//       >
//         {/* ✅ ONLY TABS */}
//         <Drawer.Screen
//           name="tabs"
//           options={{
//             title: "Dashboard",
//           }}
//         />
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
          headerShown: false,
          drawerStyle: {
            width: 280,
            backgroundColor: "#243447",
          },
        }}
        drawerContent={(props) => <AdminDrawerContent {...props} />}
      >
        {/* Only one entry – tabs */}
        <Drawer.Screen name="tabs" />
      </Drawer>
    </GestureHandlerRootView>
  );
}
