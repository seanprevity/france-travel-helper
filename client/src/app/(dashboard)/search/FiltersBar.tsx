import {
  setFilters,
  toggleFiltersFullOpen,
  toggleDescriptionFullOpen,
} from "@/state";
import { useAppSelector } from "@/state/redux";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Filter, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";
import { useSearchLocationQuery, useLazyGetRandomCityQuery } from "@/state/api";

const FiltersBar = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const filters = useAppSelector((state) => state.global.filters);
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );
  const isDescriptionFullOpen = useAppSelector(
    (state) => state.global.isDescriptionFullOpen
  );
  const [searchInput, setSearchInput] = useState(filters.location);
  const [debouncedInput, setDebouncedInput] = useState(searchInput);
  const { data: suggestions = [] } = useSearchLocationQuery(
    { input: debouncedInput },
    {
      skip: !debouncedInput,
    }
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const blurTimeout = useRef<NodeJS.Timeout | null>(null);
  const [triggerRandomCity, { isFetching }] = useLazyGetRandomCityQuery();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(searchInput);
    }, 200);

    return () => clearTimeout(handler);
  }, [searchInput]);

  return (
    <div className="flex justify-between items-center w-full py-5">
      {/* Left Section: Random City + All Filters */}
      <div className="flex items-center gap-4 p-2">
        {/* All Filters */}
        <Button
          variant="outline"
          className={cn(
            "gap-2 rounded-xl border-primary-400 hover:bg-accent hover:text-primary-100 hover:cursor-pointer",
            isFiltersFullOpen && "bg-primary-700 text-primary-100"
          )}
          onClick={() => dispatch(toggleFiltersFullOpen())}
        >
          <Filter className="w-4 h-4" />
          <span>{t("allFilters")}</span>
        </Button>

        {/* Random City Button */}
        <Button
          variant="outline"
          className={cn(
            "rounded-xl border-primary-400 hover:bg-accent hover:text-primary-100 hover:cursor-pointer"
          )}
          onClick={async () => {
            try {
              const result = await triggerRandomCity().unwrap();
              if (!result) return;
              dispatch(
                setFilters({
                  location: result.nomStandard,
                  latitude: result.latitudeMairie,
                  longitude: result.longitudeMairie,
                  insee: result.codeInsee,
                })
              );
            } catch (error) {
              console.error("Failed to fetch random city:", error);
            }
          }}
          disabled={isFetching}
        >
          <span>{t("randomCity")}</span>
        </Button>
      </div>

      {/* Center Section: Search Bar */}
      <div className="relative flex items-center w-[30rem] bg-white rounded-xl -ml-75">
        <Input
          ref={inputRef}
          placeholder={t("searchLocation")}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFocus={() => {
            if (blurTimeout.current) clearTimeout(blurTimeout.current);
            setIsFocused(true);
          }}
          onBlur={() => {
            blurTimeout.current = setTimeout(() => {
              setIsFocused(false);
            }, 100);
          }}
          className="w-full rounded-xl border-primary-400"
        />

        {/* Suggestions dropdown */}
        {searchInput.trim() !== "" && suggestions.length > 0 && isFocused && (
          <ul className="absolute top-full left-0 right-0 max-h-[250px] overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {suggestions.map((city) => (
              <li
                key={city.codeInsee}
                onMouseDown={(e) => e.preventDefault()}
                className="px-4 py-3 cursor-pointer transition-colors hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                onClick={() => {
                  setSearchInput(city.nomStandard);
                  dispatch(
                    setFilters({
                      location: city.nomStandard,
                      latitude: city.latitudeMairie,
                      longitude: city.longitudeMairie,
                      insee: city.codeInsee,
                    })
                  );
                  setIsFocused(false);
                  inputRef.current?.blur();
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col items-start text-[1.3rem] font-medium">
                    <span>{city.nomStandard}</span>
                  </div>
                  <div className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                    <span>
                      {city.depNom} — {city.regNom}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right Section: Description Toggle */}
      <div className="flex justify-between items-center gap-4 p-2">
        <div className="flex border rounded-xl bg-white">
          <Button
            variant="ghost"
            className={cn(
              "px-3 py-1 rounded-xl hover:bg-gray-200 hover:text-primary-50 hover:cursor-pointer",
              isDescriptionFullOpen && "bg-primary-700 text-primary-50"
            )}
            onClick={() => dispatch(toggleDescriptionFullOpen())}
          >
            <List className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
