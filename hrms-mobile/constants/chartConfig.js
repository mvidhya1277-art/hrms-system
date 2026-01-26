// import { Dimensions } from "react-native";

// export const screenWidth = Dimensions.get("window").width;

// export const chartConfig = {
//   backgroundGradientFrom: "#1F2A37",
//   backgroundGradientTo: "#1F2A37",
//   decimalPlaces: 0,
//   color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//   labelColor: (opacity = 1) => `rgba(203, 213, 225, ${opacity})`,
//   style: {
//     borderRadius: 16,
//   },
// };

import { Dimensions } from "react-native";

export const screenWidth = Dimensions.get("window").width;

export const chartConfig = {
  backgroundColor: "#FFFFFF",
  backgroundGradientFrom: "#FFFFFF",
  backgroundGradientTo: "#FFFFFF",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propsForLabels: {
    fontSize: 13,
    fontWeight: "500"
  },
  // Custom colors for the chart data
  color: (opacity = 1, index) => {
    const colors = [
      `rgba(34, 197, 94, ${opacity})`,  // Green for Present
      `rgba(239, 68, 68, ${opacity})`,  // Red for Absent
      `rgba(245, 158, 11, ${opacity})`, // Yellow/Orange for Late
    ];
    return colors[index] || `rgba(0, 0, 0, ${opacity})`;
  }
};