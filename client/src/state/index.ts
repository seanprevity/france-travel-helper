import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FiltersState {
  location: string;
  population: [number, number] | [null, null];
  density: [number, number] | [null, null];
  region: string;
  department: string;
  altitude: [number, number] | [null, null];
  academie: string;
  latitude: number | null;
  longitude: number | null;
  insee: string;
}

interface InitialStateTypes {
  filters: FiltersState;
  isFiltersFullOpen: boolean;
  isDescriptionFullOpen: boolean;
  viewMode: "grid" | "list";
}

export const initialState: InitialStateTypes = {
  filters: {
    location: "",
    population: [null, null],
    density: [null, null],
    region: "any",
    department: "any",
    academie: "any",
    altitude: [null, null],
    latitude: null,
    longitude: null,
    insee: "any",
  },
  isDescriptionFullOpen: false,
  isFiltersFullOpen: false,
  viewMode: "grid",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    toggleFiltersFullOpen: (state) => {
      state.isFiltersFullOpen = !state.isFiltersFullOpen;
    },
    setViewMode: (state, action: PayloadAction<"grid" | "list">) => {
      state.viewMode = action.payload;
    },
    toggleDescriptionFullOpen: (state) => {
      state.isDescriptionFullOpen = !state.isDescriptionFullOpen;
    },
  },
});

export const { setFilters, toggleFiltersFullOpen, setViewMode, toggleDescriptionFullOpen } =
  globalSlice.actions;

export default globalSlice.reducer;
