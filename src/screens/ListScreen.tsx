import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Observation } from "../types";
import { styles } from "../styles/theme";
import SectionTitle from "../components/SectionTitle";
import { formatDate } from "../utils/format";

type Props = {
  observations: Observation[];
  onOpenFilters: () => void;
  onOpenDetail: (id: number) => void;
};

export default function ListScreen({
  observations,
  onOpenFilters,
  onOpenDetail,
}: Props) {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.toolbar}>
        <SectionTitle>Observaciones</SectionTitle>
        <Pressable style={styles.secondaryButton} onPress={onOpenFilters}>
          <Text style={styles.secondaryButtonText}>Filtrar</Text>
        </Pressable>
      </View>

      <FlatList
        data={observations}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No hay observaciones guardadas todavía.
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => onOpenDetail(item.id)}>
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Text style={styles.cardMeta}>
              {item.categoria} • {formatDate(item.fecha_hora)}
            </Text>
            <Text style={styles.cardMeta}>
              {item.ubicacion_texto || "Sin ubicación en texto"}
            </Text>
            <Text numberOfLines={2} style={styles.cardBody}>
              {item.descripcion}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
