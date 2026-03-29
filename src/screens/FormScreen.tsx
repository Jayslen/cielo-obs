import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { AudioModule, RecordingPresets, setAudioModeAsync } from "expo-audio";
import { styles } from "../styles/theme";
import SectionTitle from "../components/SectionTitle";
import PillButton from "../components/PillButton";
import AudioPlayer from "../components/AudioPlayer";
import { CATEGORIES, SKY_CONDITIONS } from "../constants/options";
import { Observation } from "../types";

function nowInputValue() {
  return new Date().toISOString().slice(0, 16);
}

type Props = {
  onSave: (data: Omit<Observation, "id" | "creado_en">) => Promise<void>;
};

export default function FormScreen({ onSave }: Props) {
  const [titulo, setTitulo] = useState("");
  const [fechaHora, setFechaHora] = useState(nowInputValue());
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [ubicacionTexto, setUbicacionTexto] = useState("");
  const [duracion, setDuracion] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIES[0]);
  const [condiciones, setCondiciones] = useState(SKY_CONDITIONS[0]);
  const [descripcion, setDescripcion] = useState("");
  const [fotoPath, setFotoPath] = useState<string | null>(null);
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recordingUriRef = useRef<string | null>(null);

  function clearForm() {
    setTitulo("");
    setFechaHora(nowInputValue());
    setLat("");
    setLng("");
    setUbicacionTexto("");
    setDuracion("");
    setCategoria(CATEGORIES[0]);
    setCondiciones(SKY_CONDITIONS[0]);
    setDescripcion("");
    setFotoPath(null);
    setAudioPath(null);
  }

  async function captureGps() {
    const perm = await Location.requestForegroundPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        "Permiso denegado",
        "No se pudo acceder al GPS. Puedes escribir la ubicación manualmente.",
      );
      return;
    }
    const current = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    setLat(String(current.coords.latitude));
    setLng(String(current.coords.longitude));
  }

  async function pickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso denegado", "No se concedió acceso a las fotos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setFotoPath(result.assets[0].uri);
    }
  }

  async function toggleRecording() {
    if (!isRecording) {
      try {
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });
        const permission = await AudioModule.requestRecordingPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Permiso denegado", "No se pudo acceder al micrófono.");
          return;
        }
        const rec = await AudioModule.recordAsync(
          RecordingPresets.HIGH_QUALITY,
        );
        recordingUriRef.current = rec.uri ?? null;
        setIsRecording(true);
      } catch {
        Alert.alert("Error", "No se pudo iniciar la grabación.");
      }
    } else {
      try {
        const result = await AudioModule.stopRecordingAsync();
        setAudioPath(result.uri ?? recordingUriRef.current);
        setIsRecording(false);
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
        });
      } catch {
        Alert.alert("Error", "No se pudo detener la grabación.");
      }
    }
  }

  async function submit() {
    if (!titulo.trim() || !descripcion.trim()) {
      Alert.alert(
        "Faltan datos",
        "Completa al menos el título y la descripción.",
      );
      return;
    }

    await onSave({
      titulo: titulo.trim(),
      fecha_hora: new Date(fechaHora).toISOString(),
      lat: lat ? Number(lat) : null,
      lng: lng ? Number(lng) : null,
      ubicacion_texto: ubicacionTexto.trim() || null,
      duracion_seg: duracion ? Number(duracion) : null,
      categoria,
      condiciones_cielo: condiciones,
      descripcion: descripcion.trim(),
      foto_path: fotoPath,
      audio_path: audioPath,
    });

    clearForm();
  }

  return (
    <ScrollView contentContainerStyle={styles.formContent}>
      <SectionTitle>Nueva observación</SectionTitle>
      <TextInput
        placeholder="Título de la observación"
        placeholderTextColor="#94a3b8"
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        placeholder="Fecha y hora (YYYY-MM-DDTHH:mm)"
        placeholderTextColor="#94a3b8"
        style={styles.input}
        value={fechaHora}
        onChangeText={setFechaHora}
      />

      <View style={styles.rowGap}>
        <Pressable style={styles.secondaryButton} onPress={captureGps}>
          <Text style={styles.secondaryButtonText}>Usar GPS</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={pickPhoto}>
          <Text style={styles.secondaryButtonText}>Adjuntar foto</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={toggleRecording}>
          <Text style={styles.secondaryButtonText}>
            {isRecording ? "Detener audio" : "Grabar audio"}
          </Text>
        </Pressable>
      </View>

      <TextInput
        placeholder="Latitud"
        placeholderTextColor="#94a3b8"
        keyboardType="numeric"
        style={styles.input}
        value={lat}
        onChangeText={setLat}
      />
      <TextInput
        placeholder="Longitud"
        placeholderTextColor="#94a3b8"
        keyboardType="numeric"
        style={styles.input}
        value={lng}
        onChangeText={setLng}
      />
      <TextInput
        placeholder="Ubicación manual (sector/municipio/provincia)"
        placeholderTextColor="#94a3b8"
        style={styles.input}
        value={ubicacionTexto}
        onChangeText={setUbicacionTexto}
      />
      <TextInput
        placeholder="Duración estimada en segundos"
        placeholderTextColor="#94a3b8"
        keyboardType="numeric"
        style={styles.input}
        value={duracion}
        onChangeText={setDuracion}
      />

      <SectionTitle>Categoría</SectionTitle>
      <View style={styles.choiceWrap}>
        {CATEGORIES.map((item) => (
          <PillButton
            key={item}
            label={item}
            active={categoria === item}
            onPress={() => setCategoria(item)}
          />
        ))}
      </View>

      <SectionTitle>Condiciones del cielo</SectionTitle>
      <View style={styles.choiceWrap}>
        {SKY_CONDITIONS.map((item) => (
          <PillButton
            key={item}
            label={item}
            active={condiciones === item}
            onPress={() => setCondiciones(item)}
          />
        ))}
      </View>

      <TextInput
        placeholder="Descripción detallada: qué se vio, dirección en el cielo, altura estimada, comportamiento..."
        placeholderTextColor="#94a3b8"
        style={[styles.input, styles.textArea]}
        multiline
        value={descripcion}
        onChangeText={setDescripcion}
      />

      {fotoPath ? (
        <Image source={{ uri: fotoPath }} style={styles.previewImage} />
      ) : null}
      {audioPath ? <AudioPlayer uri={audioPath} /> : null}

      <Pressable style={styles.primaryButton} onPress={submit}>
        <Text style={styles.primaryButtonText}>Guardar observación</Text>
      </Pressable>
    </ScrollView>
  );
}
