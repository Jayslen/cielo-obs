export type Screen = "list" | "form" | "detail" | "about";

export type Observation = {
  id: number;
  titulo: string;
  fecha_hora: string;
  lat: number | null;
  lng: number | null;
  ubicacion_texto: string | null;
  duracion_seg: number | null;
  categoria: string;
  condiciones_cielo: string;
  descripcion: string;
  foto_path: string | null;
  audio_path: string | null;
  creado_en: string;
};

export type Profile = {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  foto_path: string;
  frase: string;
};
