import React from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Profile } from "../types";
import { styles } from "../styles/theme";
import SectionTitle from "../components/SectionTitle";

type Props = {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  onSave: () => Promise<void>;
};

export default function AboutScreen({ profile, setProfile, onSave }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.formContent}>
      <SectionTitle>Acerca del observador</SectionTitle>
      {profile.foto_path ? (
        <Image source={{ uri: profile.foto_path }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarPlaceholderText}>Foto</Text>
        </View>
      )}
      <View style={styles.rowGap}>
        <Pressable
          style={styles.secondaryButton}
          onPress={async () => {
            const permission =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
              Alert.alert(
                "Permiso denegado",
                "No se concedió acceso a las fotos.",
              );
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ["images"],
              quality: 0.8,
              allowsEditing: true,
            });
            if (!result.canceled && result.assets[0]?.uri) {
              setProfile((prev) => ({
                ...prev,
                foto_path: result.assets[0].uri,
              }));
            }
          }}
        >
          <Text style={styles.secondaryButtonText}>Elegir foto</Text>
        </Pressable>
      </View>
      <TextInput
        placeholder="Nombre"
        placeholderTextColor="#94a3b8"
        style={styles.input}
        value={profile.nombre}
        onChangeText={(v) => setProfile((p) => ({ ...p, nombre: v }))}
      />
      <TextInput
        placeholder="Apellido"
        placeholderTextColor="#94a3b8"
        style={styles.input}
        value={profile.apellido}
        onChangeText={(v) => setProfile((p) => ({ ...p, apellido: v }))}
      />
      <TextInput
        placeholder="Matrícula"
        placeholderTextColor="#94a3b8"
        style={styles.input}
        value={profile.matricula}
        onChangeText={(v) => setProfile((p) => ({ ...p, matricula: v }))}
      />
      <TextInput
        placeholder="Frase motivadora"
        placeholderTextColor="#94a3b8"
        style={[styles.input, styles.textArea]}
        multiline
        value={profile.frase}
        onChangeText={(v) => setProfile((p) => ({ ...p, frase: v }))}
      />
      <Pressable style={styles.primaryButton} onPress={onSave}>
        <Text style={styles.primaryButtonText}>Guardar perfil</Text>
      </Pressable>
    </ScrollView>
  );
}
