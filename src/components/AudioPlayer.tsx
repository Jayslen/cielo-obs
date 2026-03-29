import React from "react";
import { View, Text, Pressable } from "react-native";
import { useAudioPlayer } from "expo-audio";
import { styles } from "../styles/theme";

export default function AudioPlayer({ uri }: { uri: string }) {
  const player = useAudioPlayer(uri);

  return (
    <View style={styles.audioBox}>
      <Text style={styles.audioText}>Nota de voz lista para reproducir</Text>
      <View style={styles.rowGap}>
        <Pressable style={styles.secondaryButton} onPress={() => player.play()}>
          <Text style={styles.secondaryButtonText}>▶ Reproducir</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => player.pause()}
        >
          <Text style={styles.secondaryButtonText}>⏸ Pausar</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => player.seekTo(0)}
        >
          <Text style={styles.secondaryButtonText}>↺ Reiniciar</Text>
        </Pressable>
      </View>
    </View>
  );
}
