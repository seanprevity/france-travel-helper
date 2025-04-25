import React, { useEffect, useRef } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { useLanguage } from '../context/LanguageContext';
import "../styles/Map.css";

const libraries = [];
const center = { lat: 46.603354, lng: 1.888334 };
const MAP_ID = "7cfa05313dafca53";

// simple debounce helper to prevent multiple clicks at same time
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function Map({ onTownClick, selectedTown }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const { lang, t } = useLanguage();

  // Keep refs in sync with latest lang and callback
  const langRef = useRef(lang);
  useEffect(() => { langRef.current = lang; }, [lang]);

  const callbackRef = useRef(onTownClick);
  useEffect(() => { callbackRef.current = onTownClick; }, [onTownClick]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    let clickListener;
    (async () => {
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 6,
        mapId: MAP_ID,
      });
      mapInstanceRef.current = map;

      const rawClickHandler = async (e) => {
        const lat = e.latLng.lat(), lng = e.latLng.lng();
        const resTown = await fetch(`/api/nearest-town?lat=${lat}&lng=${lng}`);
        if (!resTown.ok) return;
        const town = await resTown.json();

        const pos = { lat: town.latitude, lng: town.longitude };
        map.panTo(pos);
        map.setZoom(12);

        markerRef.current?.setMap(null);
        markerRef.current = new AdvancedMarkerElement({
          map,
          position: pos,
          title: town.name,
        });

        // notify parent
        callbackRef.current?.(town);
      };

      // 1sec debounce
      const debouncedHandler = debounce(rawClickHandler, 1000);
      clickListener = map.addListener("click", debouncedHandler);
    })();

    return () => {
      if (clickListener) clickListener.remove();
      markerRef.current?.setMap(null);
    };
  }, [isLoaded]);

  // SearchBar
  useEffect(() => {
    (async () => {
      const map = mapInstanceRef.current;
      if (!map || !selectedTown) return;

      const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");
      const { latitude: lat, longitude: lng, name, department: department_code, department_name : department_name } = selectedTown;

      const geocodeTown = await fetch(`/api/geocode?town=${name}&department_code=${department_code}&department_name=${department_name}`)
      if (!geocodeTown.ok) return;
      const newTown = await geocodeTown.json()
      const pos = { lat: newTown.latitude, lng: newTown.longitude };
      map.panTo(pos);
      map.setZoom(12);

      markerRef.current?.setMap(null);
      markerRef.current = new AdvancedMarkerElement({
        map,
        position: pos,
        title: newTown.name,
      });
    })();
  }, [selectedTown]);

  if (loadError) return <div className="map-error">{t("errorFetch")}</div>;
  if (!isLoaded) return <div className="map-loading">{t("loading")}</div>;

  return <div ref={mapRef} className="map-container"/>;
}
