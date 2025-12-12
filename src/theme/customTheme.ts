import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { gunmetal } from "./color";

export const GunmetalLightTheme = {
  ...MD3LightTheme,
  roundness: 8,
  colors: {
    ...MD3LightTheme.colors,

    // BRAND / PRIMARY
    primary: gunmetal[700],
    onPrimary: gunmetal[50],
    primaryContainer: gunmetal[200],
    onPrimaryContainer: gunmetal[900],

    // SECONDARY
    secondary: gunmetal[500],
    onSecondary: gunmetal[50],
    secondaryContainer: gunmetal[200],
    onSecondaryContainer: gunmetal[800],

    // TERTIARY
    tertiary: gunmetal[400],
    onTertiary: gunmetal[50],
    tertiaryContainer: gunmetal[300],
    onTertiaryContainer: gunmetal[900],

    // BACKGROUND
    background: gunmetal[50],
    onBackground: gunmetal[900],

    // SURFACE
    surface: gunmetal[50],
    onSurface: gunmetal[900],

    surfaceVariant: gunmetal[200],
    onSurfaceVariant: gunmetal[700],

    // OUTLINE
    outline: gunmetal[400],
    outlineVariant: gunmetal[300],

    // ERROR (kept red because it's standard)
    error: "#e74c3c",
    onError: gunmetal[50],
    errorContainer: "#fddede",
    onErrorContainer: "#7a2525",

    // INVERSE
    inverseSurface: gunmetal[900],
    inverseOnSurface: gunmetal[50],
    inversePrimary: gunmetal[300],

    shadow: "rgba(0,0,0,0.2)",

    // full scale exposed
    gunmetal,
  },
};


export const GunmetalDarkTheme = {
  ...MD3DarkTheme,
  roundness: 8,
  colors: {
    ...MD3DarkTheme.colors,

    // BRAND / PRIMARY
    primary: gunmetal[300],
    onPrimary: gunmetal[900],
    primaryContainer: gunmetal[700],
    onPrimaryContainer: gunmetal[50],

    // SECONDARY
    secondary: gunmetal[400],
    onSecondary: gunmetal[900],
    secondaryContainer: gunmetal[600],
    onSecondaryContainer: gunmetal[50],

    // TERTIARY
    tertiary: gunmetal[300],
    onTertiary: gunmetal[950],
    tertiaryContainer: gunmetal[700],
    onTertiaryContainer: gunmetal[50],

    // BACKGROUND
    background: gunmetal[950],
    onBackground: gunmetal[50],

    // SURFACE
    surface: gunmetal[900],
    onSurface: gunmetal[50],

    surfaceVariant: gunmetal[800],
    onSurfaceVariant: gunmetal[200],

    // OUTLINE
    outline: gunmetal[600],
    outlineVariant: gunmetal[700],

    // ERROR
    error: "#ff6b6b",
    onError: gunmetal[950],
    errorContainer: "#7a2525",
    onErrorContainer: "#fddede",

    // INVERSE
    inverseSurface: gunmetal[100],
    inverseOnSurface: gunmetal[900],
    inversePrimary: gunmetal[200],

    shadow: "rgba(0,0,0,0.7)",

    gunmetal,
  },
};
