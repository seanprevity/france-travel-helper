import { FiltersState, initialState, setFilters } from "@/state";
import { useAppSelector } from "@/state/redux";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import { cleanParams } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/context/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FiltersFull = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useAppSelector((state) => state.global.filters);
  const [localFilters, setLocalFilters] = useState(filters);
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );

  const updateURL = debounce((newFilters: FiltersState) => {
    const cleanFilters = cleanParams(newFilters);
    const updatedSearchParams = new URLSearchParams();

    Object.entries(cleanFilters).forEach(([key, value]) => {
      updatedSearchParams.set(
        key,
        Array.isArray(value) ? value.join(",") : value.toString()
      );
    });

    router.push(`${pathname}?${updatedSearchParams.toString()}`);
  });

  const handleSubmit = () => {
    dispatch(setFilters(localFilters));
    updateURL(localFilters);
  };

  const handleReset = () => {
    setLocalFilters(initialState.filters);
    dispatch(setFilters(initialState.filters));
    updateURL(initialState.filters);
  };

  if (!isFiltersFullOpen) return null;

  return (
    <div className="bg-white rounded-lg px-4 h-full overflow-auto pb-10">
      <div className="flex flex-col space-y-6">
        {/* Region, Department and Academy */}
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <h4 className="font-bold mb-2">{t("region")}</h4>
            <Select
              value={localFilters.region || "any"}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, region: value }))
              }
            >
              <SelectTrigger className="w-full rounded-xl hover:cursor-pointer">
                <SelectValue placeholder={t("region")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{t("anyRegion")}</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <h4 className="font-bold mb-2">{t("department")}</h4>
            <Select
              value={localFilters.department || "any"}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, department: value }))
              }
            >
              <SelectTrigger className="w-full rounded-xl hover:cursor-pointer">
                <SelectValue placeholder={t("anyDepartment")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{t("anyDepartment")}</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <h4 className="font-bold mb-2">{t("academie")}</h4>
            <Select
              value={localFilters.academie || "any"}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, academie: value }))
              }
            >
              <SelectTrigger className="w-full rounded-xl hover:cursor-pointer">
                <SelectValue placeholder={t("anyAcademie")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{t("anyAcademie")}</SelectItem>
                {academies.map((academy) => (
                  <SelectItem key={academy} value={academy}>
                    {academy}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Population */}
        <div>
          <h4 className="font-bold mb-2">Population</h4>
          <Slider
            min={0}
            max={800000}
            step={1000}
            value={[
              localFilters.population[0] ?? 0,
              localFilters.population[1] ?? 800000,
            ]}
            onValueChange={(value: any) =>
              setLocalFilters((prev) => ({
                ...prev,
                population: value as [number, number],
              }))
            }
          />
          <div className="flex justify-between mt-2">
            <span>{localFilters.population[0] ?? 0}</span>
            <span>
              {localFilters.population[1] == null ||
              localFilters.population[1] === 800000
                ? `800000+`
                : localFilters.population[1]}
            </span>
          </div>
        </div>

        {/* Density */}
        <div>
          <h4 className="font-bold mb-2">{t("Density")}</h4>
          <Slider
            min={0}
            max={20000}
            step={100}
            value={[
              localFilters.density[0] ?? 0,
              localFilters.density[1] ?? 20000,
            ]}
            onValueChange={(value) =>
              setLocalFilters((prev) => ({
                ...prev,
                density: value as [number, number],
              }))
            }
            className="[&>.bar]:bg-primary-700"
          />
          <div className="flex justify-between mt-2">
            <span>{localFilters.density[0] ?? 0}</span>
            <span>{localFilters.density[1] ?? 20000}</span>
          </div>
        </div>

        {/* Altitude */}
        <div>
          <h4 className="font-bold mb-2">{t("Altitude")}</h4>
          <Slider
            min={0}
            max={1600}
            step={10}
            value={[
              localFilters.altitude[0] ?? 0,
              localFilters.altitude[1] ?? 1600,
            ]}
            onValueChange={(value) =>
              setLocalFilters((prev) => ({
                ...prev,
                altitude: value as [number, number],
              }))
            }
            className="[&>.bar]:bg-primary-700"
          />
          <div className="flex justify-between mt-2">
            <span>{localFilters.altitude[0] ?? 0}</span>
            <span>{localFilters.altitude[1] ?? 1600}</span>
          </div>
        </div>

        {/* Latitude and Longitude */}
        <div>
          <h4 className="font-bold mb-2">{t("Coordinates")}</h4>
          <div className="flex gap-4">
            <Input
              type="number"
              placeholder="Latitude"
              value={
                localFilters.latitude !== null
                  ? localFilters.latitude.toString()
                  : ""
              }
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  latitude: e.target.value ? parseFloat(e.target.value) : null,
                }))
              }
              className="flex-1 rounded-xl"
            />
            <Input
              type="number"
              placeholder="Longitude"
              value={
                localFilters.longitude !== null
                  ? localFilters.longitude.toString()
                  : ""
              }
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  longitude: e.target.value ? parseFloat(e.target.value) : null,
                }))
              }
              className="flex-1 rounded-xl"
            />
          </div>
        </div>

        {/* Apply and Reset buttons */}
        <div className="flex gap-4 mt-6">
          <Button
            onClick={handleSubmit}
            variant="outline"
            className="flex-1 rounded-xl hover:cursor-pointer"
          >
            {t("Apply")}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 rounded-xl hover:cursor-pointer"
          >
            {t("Reset")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltersFull;

const regions = [
  "Auvergne-Rhône-Alpes",
  "Hauts-de-France",
  "Provence-Alpes-Côte d'Azur",
  "Grand Est",
  "Occitanie",
  "Corse",
  "Centre-Val de Loire",
  "Île-de-France",
  "Normandie",
  "Nouvelle-Aquitaine",
  "Pays de la Loire",
  "Bretagne",
  "Bourgogne-Franche-Comté",
  "Guadeloupe",
  "Guyane",
  "Martinique",
  "Mayotte",
  "La Réunion",
];

const academies = [
  "Aix-Marseille",
  "Amiens",
  "Besançon",
  "Bordeaux",
  "Clermont-Ferrand",
  "Corse",
  "Créteil",
  "Dijon",
  "Grenoble",
  "Guadeloupe",
  "Guyane",
  "La Réunion",
  "Lille",
  "Limoges",
  "Lyon",
  "Martinique",
  "Mayotte",
  "Montpellier",
  "Nancy-Metz",
  "Nantes",
  "Nice",
  "Normandie",
  "Orléans-Tours",
  "Paris",
  "Poitiers",
  "Reims",
  "Rennes",
  "Strasbourg",
  "Toulouse",
  "Versailles",
];

const departments = [
  "Ain",
  "Aisne",
  "Allier",
  "Alpes-Maritimes",
  "Alpes-de-Haute-Provence",
  "Ardennes",
  "Ardèche",
  "Ariège",
  "Aube",
  "Aude",
  "Aveyron",
  "Bas-Rhin",
  "Bouches-du-Rhône",
  "Calvados",
  "Cantal",
  "Charente",
  "Charente-Maritime",
  "Cher",
  "Corrèze",
  "Corse-du-Sud",
  "Creuse",
  "Côte-d'Or",
  "Côtes-d'Armor",
  "Deux-Sèvres",
  "Dordogne",
  "Doubs",
  "Drôme",
  "Essonne",
  "Eure",
  "Eure-et-Loir",
  "Finistère",
  "Gard",
  "Gers",
  "Gironde",
  "Guadeloupe",
  "Guyane",
  "Haut-Rhin",
  "Haute-Corse",
  "Haute-Garonne",
  "Haute-Loire",
  "Haute-Marne",
  "Haute-Savoie",
  "Haute-Saône",
  "Haute-Vienne",
  "Hautes-Alpes",
  "Hautes-Pyrénées",
  "Hauts-de-Seine",
  "Hérault",
  "Ille-et-Vilaine",
  "Indre",
  "Indre-et-Loire",
  "Isère",
  "Jura",
  "La Réunion",
  "Landes",
  "Loir-et-Cher",
  "Loire",
  "Loire-Atlantique",
  "Loiret",
  "Lot",
  "Lot-et-Garonne",
  "Lozère",
  "Maine-et-Loire",
  "Manche",
  "Marne",
  "Martinique",
  "Mayenne",
  "Mayotte",
  "Meurthe-et-Moselle",
  "Meuse",
  "Morbihan",
  "Moselle",
  "Nièvre",
  "Nord",
  "Oise",
  "Orne",
  "Paris",
  "Pas-de-Calais",
  "Puy-de-Dôme",
  "Pyrénées-Atlantiques",
  "Pyrénées-Orientales",
  "Rhône",
  "Sarthe",
  "Savoie",
  "Saône-et-Loire",
  "Seine-Maritime",
  "Seine-Saint-Denis",
  "Seine-et-Marne",
  "Somme",
  "Tarn",
  "Tarn-et-Garonne",
  "Territoire de Belfort",
  "Val-d'Oise",
  "Val-de-Marne",
  "Var",
  "Vaucluse",
  "Vendée",
  "Vienne",
  "Vosges",
  "Yonne",
  "Yvelines",
];
