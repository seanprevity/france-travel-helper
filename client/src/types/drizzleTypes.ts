export interface City {
  codeInsee: string;
  nomStandard: string;
  typecomTexte: string | null;
  regCode: number;
  regNom: string;
  depCode: string;
  depNom: string;
  cantonCode: string | null;
  cantonNom: string | null;
  academieCode: number | null;
  academieNom: string | null;
  population: number | null;
  superficieHectare: number | null;
  superficieKm2: number | null;
  densite: number | null;
  altitudeMoyenne: number | null;
  altitudeMinimale: string | null;
  altitudeMaximale: string | null;
  latitudeMairie: number | null;
  longitudeMairie: number | null;
  latitudeCentre: number | null;
  longitudeCentre: number | null;
  grilleDensite: number | null;
  grilleDensiteTexte: string | null;
  urlWikipedia: string | null;
  urlVilledereve: string | null;
}

export interface User {
  userId: number;
  username: string;
  email: string;
  cognitoId: string;
}

export interface Region {
  id: number;
  code: string;
  capital: string;
  name: string;
}

export interface Department {
  id: number;
  code: string;
  capital: string;
  region: string;
  name: string;
}

export interface Town {
  id: number;
  code: string;
  article: string | null;
  name: string;
  department: string;
  latitude: number | null;
  longitude: number | null;
  population: number;
}

export interface Bookmark {
  id: number;
  userId: number;
  inseeCode: string;
}

export interface Rating {
  id: number;
  inseeCode: string;
  userId: number;
  rating: number;
}

export interface Description {
  id: number;
  inseeCode: string;
  language: string;
  description: string;
}

export interface Weather {
  country: string;
  location: string;
  region: string;
  forecast: WeatherDay[];
}

export interface WeatherDay {
  date: string;
  icon: string;
  description: string;
  temp_max: number;
  temp_min: number;
}

export interface Image {
  url?: string;
  description?: string;
}
