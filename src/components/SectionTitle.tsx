import React from "react";
import { Text } from "react-native";
import { styles } from "../styles/theme";

export default function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}
