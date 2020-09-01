import { DefaultTheme } from 'react-native-paper';

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: 'orange',
        accent: '#f1c40f',
    }
};
export default theme;