import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import {
  initDb,
  readProfile,
  wipeAllData,
  getObservations,
  getObservation,
  saveProfile,
  insertObservation,
} from "./src/db/database";
import { DEFAULT_PROFILE, CATEGORIES } from "./src/constants/options";
import { Observation, Profile, Screen } from "./src/types";
import { styles } from "./src/styles/theme";
import PillButton from "./src/components/PillButton";
import ListScreen from "./src/screens/ListScreen";
import FormScreen from "./src/screens/FormScreen";
import DetailScreen from "./src/screens/DetailScreen";
import AboutScreen from "./src/screens/AboutScreen";

export default function App() {
  const [screen, setScreen] = useState<Screen>("list");
  const [loading, setLoading] = useState(true);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedObservation, setSelectedObservation] =
    useState<Observation | null>(null);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [placeFilter, setPlaceFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filterModal, setFilterModal] = useState(false);

  const appName = `cielo_obs_${profile.matricula}`;

  useEffect(() => {
    (async () => {
      await initDb();
      const savedProfile = await readProfile();
      if (savedProfile) setProfile(savedProfile);
      await refreshList();
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (selectedId !== null) {
      (async () => {
        const row = await getObservation(selectedId);
        setSelectedObservation(row ?? null);
      })();
    }
  }, [selectedId]);

  async function refreshList() {
    const rows = await getObservations({
      category: categoryFilter,
      place: placeFilter,
      date: dateFilter,
    });
    setObservations(rows);
  }

  async function handleDeleteAll() {
    Alert.alert(
      "Borrar todo",
      "Esta acción eliminará observaciones y perfil local del dispositivo. ¿Deseas continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, borrar",
          style: "destructive",
          onPress: async () => {
            await wipeAllData();
            setProfile(DEFAULT_PROFILE);
            setSelectedId(null);
            setSelectedObservation(null);
            await refreshList();
            setScreen("list");
            Alert.alert("Listo", "Todos los datos locales fueron eliminados.");
          },
        },
      ],
    );
  }

  async function handleSaveProfile() {
    await saveProfile(profile);
    Alert.alert(
      "Perfil actualizado",
      "La sección Acerca de fue guardada localmente.",
    );
  }

  async function handleSaveObservation(
    data: Omit<Observation, "id" | "creado_en">,
  ) {
    await insertObservation(data);
    await refreshList();
    setScreen("list");
    Alert.alert("Guardado", "La observación fue almacenada localmente.");
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.title}>Cielo Obs RD</Text>
        <Text style={styles.subtitle}>Cargando base de datos local...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🌌 Cielo Obs RD</Text>
          <Text style={styles.subtitle}>Icono sugerido: {appName}</Text>
        </View>
        <Pressable style={styles.dangerButton} onPress={handleDeleteAll}>
          <Text style={styles.dangerButtonText}>Borrar Todo</Text>
        </Pressable>
      </View>

      <View style={styles.navBar}>
        <PillButton
          label="Lista"
          active={screen === "list"}
          onPress={() => setScreen("list")}
        />
        <PillButton
          label="Nueva"
          active={screen === "form"}
          onPress={() => setScreen("form")}
        />
        <PillButton
          label="Acerca de"
          active={screen === "about"}
          onPress={() => setScreen("about")}
        />
      </View>

      {screen === "list" && (
        <ListScreen
          observations={observations}
          onOpenFilters={() => setFilterModal(true)}
          onOpenDetail={(id) => {
            setSelectedId(id);
            setScreen("detail");
          }}
        />
      )}

      {screen === "form" && <FormScreen onSave={handleSaveObservation} />}

      {screen === "detail" && selectedObservation && (
        <DetailScreen
          observation={selectedObservation}
          onBack={() => setScreen("list")}
        />
      )}

      {screen === "about" && (
        <AboutScreen
          profile={profile}
          setProfile={setProfile}
          onSave={handleSaveProfile}
        />
      )}

      <Modal visible={filterModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.sectionTitle}>Filtros</Text>
            <TextInput
              placeholder="Lugar"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={placeFilter}
              onChangeText={setPlaceFilter}
            />
            <TextInput
              placeholder="Fecha exacta YYYY-MM-DD"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={dateFilter}
              onChangeText={setDateFilter}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.choiceWrap}
            >
              {["Todas", ...CATEGORIES].map((item) => (
                <PillButton
                  key={item}
                  label={item}
                  active={categoryFilter === item}
                  onPress={() => setCategoryFilter(item)}
                />
              ))}
            </ScrollView>
            <View style={styles.rowGap}>
              <Pressable
                style={styles.primaryButton}
                onPress={async () => {
                  await refreshList();
                  setFilterModal(false);
                }}
              >
                <Text style={styles.primaryButtonText}>Aplicar</Text>
              </Pressable>
              <Pressable
                style={styles.secondaryButton}
                onPress={async () => {
                  setCategoryFilter("Todas");
                  setPlaceFilter("");
                  setDateFilter("");
                  setTimeout(async () => {
                    await refreshList();
                  }, 0);
                  setFilterModal(false);
                }}
              >
                <Text style={styles.secondaryButtonText}>Limpiar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
