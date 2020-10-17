import { DefaultTheme } from "react-native-paper";
import color from 'color'

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#e95420",
    accent: "#f1c40f",
    header: "#007bff",
    success: "#28a745",
    error: "#ED1651",
    borderColor: color('#000000').alpha(0.54).rgb().string()
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
