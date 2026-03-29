import * as SQLite from "expo-sqlite";
import { DEFAULT_PROFILE } from "../constants/options";
import { Observation, Profile } from "../types";
import { nowIso } from "../utils/format";

const dbPromise = SQLite.openDatabaseAsync("cielo_obs.db");

export async function initDb() {
  const db = await dbPromise;
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS observacion (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      fecha_hora TEXT NOT NULL,
      lat REAL,
      lng REAL,
      ubicacion_texto TEXT,
      duracion_seg INTEGER,
      categoria TEXT NOT NULL,
      condiciones_cielo TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      foto_path TEXT,
      audio_path TEXT,
      creado_en TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS perfil (
      id INTEGER PRIMARY KEY,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      matricula TEXT NOT NULL,
      foto_path TEXT,
      frase TEXT NOT NULL
    );
  `);

  const existing = await db.getFirstAsync<Profile>(
    "SELECT * FROM perfil WHERE id = 1",
  );
  if (!existing) {
    await db.runAsync(
      "INSERT INTO perfil (id, nombre, apellido, matricula, foto_path, frase) VALUES (?, ?, ?, ?, ?, ?)",
      [
        DEFAULT_PROFILE.id,
        DEFAULT_PROFILE.nombre,
        DEFAULT_PROFILE.apellido,
        DEFAULT_PROFILE.matricula,
        DEFAULT_PROFILE.foto_path,
        DEFAULT_PROFILE.frase,
      ],
    );
  }
}

export async function getObservations(filters?: {
  category?: string;
  place?: string;
  date?: string;
}) {
  const db = await dbPromise;
  const clauses: string[] = [];
  const params: (string | number)[] = [];

  if (filters?.category && filters.category !== "Todas") {
    clauses.push("categoria = ?");
    params.push(filters.category);
  }
  if (filters?.place) {
    clauses.push('(IFNULL(ubicacion_texto, "") LIKE ?)');
    params.push(`%${filters.place}%`);
  }
  if (filters?.date) {
    clauses.push("date(fecha_hora) = date(?)");
    params.push(filters.date);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return db.getAllAsync<Observation>(
    `SELECT * FROM observacion ${where} ORDER BY fecha_hora DESC`,
    params,
  );
}

export async function getObservation(id: number) {
  const db = await dbPromise;
  return db.getFirstAsync<Observation>(
    "SELECT * FROM observacion WHERE id = ?",
    [id],
  );
}

export async function insertObservation(
  data: Omit<Observation, "id" | "creado_en">,
) {
  const db = await dbPromise;
  await db.runAsync(
    `INSERT INTO observacion (
      titulo, fecha_hora, lat, lng, ubicacion_texto, duracion_seg, categoria,
      condiciones_cielo, descripcion, foto_path, audio_path, creado_en
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.titulo,
      data.fecha_hora,
      data.lat,
      data.lng,
      data.ubicacion_texto,
      data.duracion_seg,
      data.categoria,
      data.condiciones_cielo,
      data.descripcion,
      data.foto_path,
      data.audio_path,
      nowIso(),
    ],
  );
}

export async function readProfile() {
  const db = await dbPromise;
  return db.getFirstAsync<Profile>("SELECT * FROM perfil WHERE id = 1");
}

export async function saveProfile(profile: Profile) {
  const db = await dbPromise;
  await db.runAsync(
    "UPDATE perfil SET nombre = ?, apellido = ?, matricula = ?, foto_path = ?, frase = ? WHERE id = 1",
    [
      profile.nombre,
      profile.apellido,
      profile.matricula,
      profile.foto_path,
      profile.frase,
    ],
  );
}

export async function wipeAllData() {
  const db = await dbPromise;
  await db.execAsync(`DELETE FROM observacion; DELETE FROM perfil;`);
  await db.runAsync(
    "INSERT INTO perfil (id, nombre, apellido, matricula, foto_path, frase) VALUES (?, ?, ?, ?, ?, ?)",
    [
      DEFAULT_PROFILE.id,
      DEFAULT_PROFILE.nombre,
      DEFAULT_PROFILE.apellido,
      DEFAULT_PROFILE.matricula,
      DEFAULT_PROFILE.foto_path,
      DEFAULT_PROFILE.frase,
    ],
  );
}
