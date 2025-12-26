import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { AppMDMThemeColors, gunmetal } from "./color";

export const GunmetalLightTheme = {
  ...MD3LightTheme,
  roundness: 8,
  colors: {
    ...MD3LightTheme.colors,

    // BRAND / PRIMARY
    primary: AppMDMThemeColors.primary,
    onPrimary: gunmetal[50],
    primaryContainer: gunmetal[200],
    onPrimaryContainer: gunmetal[900],

    // SECONDARY
    secondary: AppMDMThemeColors.white,
    onSecondary: gunmetal[50],
    secondaryContainer: gunmetal[200],
    onSecondaryContainer: gunmetal[800],

    // TERTIARY
    tertiary: AppMDMThemeColors.approval,
    onTertiary: gunmetal[50],
    tertiaryContainer: gunmetal[300],
    onTertiaryContainer: gunmetal[900],

    // BACKGROUND
    background: AppMDMThemeColors.second,
    onBackground: AppMDMThemeColors.second,

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
