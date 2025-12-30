import { MD3LightTheme } from "react-native-paper";
import { amber, neutral, teal } from "./color";

export const AppLightTheme = {
  ...MD3LightTheme,
  roundness: 8,
  colors: {
    ...MD3LightTheme.colors,

    // PRIMARY – Teal
    primary: teal[500],
    onPrimary: neutral.white,
    primaryContainer: teal[100],
    onPrimaryContainer: teal[900],

    // SECONDARY – Amber
    secondary: amber[600],
    onSecondary: neutral.heading,
    secondaryContainer: amber[100],
    onSecondaryContainer: amber[900],

    // TERTIARY – soft accent
    tertiary: amber[600],
    onTertiary: neutral.white,
    tertiaryContainer: amber[300],
    onTertiaryContainer: amber[900],

    // BACKGROUND
    background: neutral.bg,
    onBackground: neutral.heading,

    // SURFACE
    surface: neutral.white,
    onSurface: neutral.heading,
    surfaceVariant: neutral.border,
    onSurfaceVariant: neutral.text,

    // OUTLINE / DIVIDERS
    outline: neutral.border,
    outlineVariant: neutral.muted,

    // ERROR (standard)
    error: "#e74c3c",
    onError: neutral.white,
    errorContainer: "#fddede",
    onErrorContainer: "#7a2525",

    // INVERSE (still needed internally by MD3)
    inverseSurface: neutral.heading,
    inverseOnSurface: neutral.white,
    inversePrimary: teal[300],

    shadow: "rgba(0,0,0,0.15)",

    // expose palettes
    teal,
    amber,
    neutral,
  },
};