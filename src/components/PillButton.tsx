import React from "react";
import { Pressable, Text } from "react-native";
import { styles } from "../styles/theme";

type Props = {
  label: string;
  active?: boolean;
  onPress: () => void;
};

export default function PillButton({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, active && styles.pillActive]}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}
