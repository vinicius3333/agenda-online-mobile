import { DefaultTheme } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#f0ad4e",
    accent: "#f1c40f",
    header: "#007bff",
    success: "#28a745",
  },
  text: {
    size: {
      h1: 36,
      h2: 24,
    },
    colors: {
      primary: "#60656C",
      secondary: "white",
    },
  },
};
export default theme;
