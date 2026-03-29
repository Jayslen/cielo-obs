import React from "react";
import { Image, Pressable, ScrollView, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Observation } from "../types";
import { styles } from "../styles/theme";
import SectionTitle from "../components/SectionTitle";
import AudioPlayer from "../components/AudioPlayer";
import { formatDate } from "../utils/format";

type Props = {
  observation: Observation;
  onBack: () => void;
};

export default function DetailScreen({ observation, onBack }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.formContent}>
      <SectionTitle>Detalle</SectionTitle>
      <Text style={styles.cardTitle}>{observation.titulo}</Text>
      <Text style={styles.detailLine}>
        <Text style={styles.label}>Fecha:</Text>{" "}
        {formatDate(observation.fecha_hora)}
      </Text>
      <Text style={styles.detailLine}>
        <Text style={styles.label}>Categoría:</Text> {observation.categoria}
      </Text>
      <Text style={styles.detailLine}>
        <Text style={styles.label}>Cielo:</Text> {observation.condiciones_cielo}
      </Text>
      <Text style={styles.detailLine}>
        <Text style={styles.label}>Duración:</Text>{" "}
        {observation.duracion_seg ?? "N/D"} segundos
      </Text>
      <Text style={styles.detailLine}>
        <Text style={styles.label}>Ubicación:</Text>{" "}
        {observation.ubicacion_texto || "No especificada"}
      </Text>
      <Text style={styles.detailLine}>
        <Text style={styles.label}>GPS:</Text> {observation.lat ?? "—"},{" "}
        {observation.lng ?? "—"}
      </Text>
      <Text style={styles.detailLine}>
        <Text style={styles.label}>Descripción:</Text> {observation.descripcion}
      </Text>

      {observation.foto_path ? (
        <Image
          source={{ uri: observation.foto_path }}
          style={styles.previewImage}
        />
      ) : null}
      {observation.audio_path ? (
        <AudioPlayer uri={observation.audio_path} />
      ) : null}

      {observation.lat !== null && observation.lng !== null ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: observation.lat,
            longitude: observation.lng,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          <Marker
            coordinate={{
              latitude: observation.lat,
              longitude: observation.lng,
            }}
            title={observation.titulo}
          />
        </MapView>
      ) : (
        <Text style={styles.emptyText}>
          No se capturó GPS. Se muestra ubicación en texto cuando está
          disponible.
        </Text>
      )}

      <Pressable style={styles.secondaryButton} onPress={onBack}>
        <Text style={styles.secondaryButtonText}>Volver a la lista</Text>
      </Pressable>
    </ScrollView>
  );
}
