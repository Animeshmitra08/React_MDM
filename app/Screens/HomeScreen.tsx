import React, { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import {
  Text,
  Button,
  Card,
  Surface,
  Divider,
  TextInput,
  IconButton,
  Chip,
  Switch,
  Checkbox,
  RadioButton,
  useTheme,
} from "react-native-paper";

const ThemePreview = () => {
  const theme = useTheme();
  const [checked, setChecked] = useState(false);
  const [radio, setRadio] = useState("first");
  const [switchOn, setSwitchOn] = useState(false);

  return (
    <>
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >

      {/* ---------------- Header ---------------- */}
      <Text style={[styles.heading, { color: theme.colors.primary }]}>
        Theme Preview
      </Text>
      <Text style={{ color: theme.colors.onBackground, opacity: 0.7 }}>
        Modern UI Theme (Typography + Components Showcase)
      </Text>

      <Divider style={styles.divider} />

      {/* ---------------- Typography ---------------- */}
      <Text style={styles.sectionTitle}>Typography</Text>

      <Text variant="displayLarge">Display Large</Text>
      <Text variant="displayMedium">Display Medium</Text>
      <Text variant="displaySmall">Display Small</Text>

      <Text variant="headlineLarge">Headline Large</Text>
      <Text variant="headlineMedium">Headline Medium</Text>
      <Text variant="headlineSmall">Headline Small</Text>

      <Text variant="titleLarge">Title Large</Text>
      <Text variant="titleMedium">Title Medium</Text>
      <Text variant="titleSmall">Title Small</Text>

      <Text variant="bodyLarge">Body Large</Text>
      <Text variant="bodyMedium">Body Medium</Text>
      <Text variant="bodySmall">Body Small</Text>

      <Text variant="labelLarge">Label Large</Text>
      <Text variant="labelMedium">Label Medium</Text>
      <Text variant="labelSmall">Label Small</Text>

      <Divider style={styles.divider} />

      {/* ---------------- Buttons ---------------- */}
      <Text style={styles.sectionTitle}>Buttons</Text>

      <Button mode="contained" style={styles.button}>
        Contained Button
      </Button>
      <Button mode="outlined" style={styles.button}>
        Outlined Button
      </Button>
      <Button mode="text" style={styles.button}>
        Text Button
      </Button>

      <View style={styles.row}>
        <Button mode="contained-tonal">Tonal</Button>
        <IconButton icon="heart" size={24} onPress={() => {}} />
      </View>

      <Divider style={styles.divider} />

      {/* ---------------- Text Inputs ---------------- */}
      <Text style={styles.sectionTitle}>Text Inputs</Text>

      <TextInput label="Name" mode="outlined" style={styles.input} />
      <TextInput label="Email" mode="flat" style={styles.input} />

      <Divider style={styles.divider} />

      {/* ---------------- Chips ---------------- */}
      <Text style={styles.sectionTitle}>Chips</Text>

      <View style={styles.row}>
        <Chip icon="information">Default</Chip>
        <Chip selected>Selected</Chip>
        <Chip icon="check" onPress={() => {}}>
          Click Me
        </Chip>
      </View>

      <Divider style={styles.divider} />

      {/* ---------------- Toggles ---------------- */}
      <Text style={styles.sectionTitle}>Toggles</Text>

      <View style={styles.row}>
        <Switch value={switchOn} onValueChange={() => setSwitchOn(!switchOn)} />

        <Checkbox
          status={checked ? "checked" : "unchecked"}
          onPress={() => setChecked(!checked)}
        />

        <RadioButton
          value="first"
          status={radio === "first" ? "checked" : "unchecked"}
          onPress={() => setRadio("first")}
        />
      </View>

      <Divider style={styles.divider} />

      {/* ---------------- Surface & Elevation ---------------- */}
      <Text style={styles.sectionTitle}>Surface & Elevation</Text>

      <Surface style={[styles.surface, { elevation: 1 }]}>
        <Text>Elevation 1</Text>
      </Surface>

      <Surface style={[styles.surface, { elevation: 3 }]}>
        <Text>Elevation 3</Text>
      </Surface>

      <Surface style={[styles.surface, { elevation: 6 }]}>
        <Text>Elevation 6</Text>
      </Surface>

      <Divider style={styles.divider} />

      {/* ---------------- Card ---------------- */}
      <Text style={styles.sectionTitle}>Cards</Text>

      <Card style={styles.card} mode="elevated">
        <Card.Title title="Modern Card" subtitle="Styled with theme colors" />
        <Card.Content>
          <Text variant="bodyMedium">
            Cards automatically adapt to your theme surface colors.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button>Action</Button>
        </Card.Actions>
      </Card>

      <View style={{ height: 50 }} />
    </ScrollView>
    </>
  );
};

export default ThemePreview;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 20,
    // paddingBottom: 80,
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 20,
  },
  divider: {
    marginVertical: 18,
  },
  button: {
    marginVertical: 6,
  },
  input: {
    marginVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 6,
  },
  surface: {
    padding: 18,
    borderRadius: 12,
    marginVertical: 8,
  },
  card: {
    borderRadius: 16,
    marginVertical: 10,
  },
});