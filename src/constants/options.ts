import { Profile } from "../types";

export const CATEGORIES = [
  "Fenómeno atmosférico",
  "Astronomía",
  "Aves",
  "Aeronave/Objeto artificial",
  "Otro",
];

export const SKY_CONDITIONS = [
  "Despejado",
  "Parcialmente nublado",
  "Nublado",
  "Bruma",
  "Lluvia ligera",
];

export const DEFAULT_PROFILE: Profile = {
  id: 1,
  nombre: "Alan",
  apellido: "Franco",
  matricula: "20241234",
  foto_path: "",
  frase:
    "Observar el cielo es entrenar la curiosidad para descubrir lo extraordinario en lo cotidiano.",
};
