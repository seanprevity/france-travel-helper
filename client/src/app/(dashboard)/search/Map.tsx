"use client";

import type { Feature, Geometry } from "geojson";
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppSelector } from "@/state/redux";
import { useGetCitiesQuery, getCity } from "@/state/api";
import type { FeatureCollection, Point } from "geojson";
import { useAppDispatch } from "@/state/redux";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const Map = () => {
  const dispatch = useAppDispatch();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const filters = useAppSelector((state) => state.global.filters);
  const { data: cities, isLoading, isError } = useGetCitiesQuery(filters);
  const sidebarOpen = useAppSelector((state) => state.global.isFiltersFullOpen);
  const descriptionOpen = useAppSelector(
    (state) => state.global.isDescriptionFullOpen
  );

  useEffect(() => {
    if (isLoading || isError || !cities) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    // lat & lng are set to middle of France by default, zoomed out farther to show entire country
    const lat = filters.latitude ?? 46.7776;
    const lng = filters.longitude ?? 2.2137;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/seanprevity/cmd24tk2w01gm01qv2o9d8cus",
      center: [lng, lat],
      zoom: lat == 46.7776 && lng == 2.2137 ? 4.8 : 9,
    });
    mapRef.current = map;

    map.on("load", async () => {
      const cityGeoJson: FeatureCollection<Point> = {
        type: "FeatureCollection",
        features: cities.map((city) => ({
          type: "Feature",
          properties: {
            name: city.nomStandard,
            region: city.regNom,
            department: city.depNom,
            inseeCode: city.codeInsee,
            latitude: city.latitudeMairie,
            longitude: city.longitudeMairie,
          },
          geometry: {
            type: "Point",
            coordinates: [city.longitudeMairie!, city.latitudeMairie!],
          },
        })),
      };

      map.addSource("cities", {
        type: "geojson",
        data: cityGeoJson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "cities",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#000000",
          "circle-radius": 20,
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "cities",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "cities",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#000000",
          "circle-radius": 6,
        },
      });

      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const clusterId = features[0]?.properties?.cluster_id;
        const source = map.getSource("cities") as mapboxgl.GeoJSONSource;

        if (clusterId !== undefined && source.getClusterExpansionZoom) {
          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;
            const geometry = features[0].geometry;
            if (geometry.type === "Point") {
              const coordinates = geometry.coordinates as [number, number];
              map.easeTo({
                center: coordinates,
                zoom: (zoom ?? 9) + 0.4,
              });
            }
          });
        }
      });

      map.on("click", "unclustered-point", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        // assert geometry as Point
        const coordinates = (feature.geometry as GeoJSON.Point).coordinates;

        // assert known properties
        const { name, region, department, inseeCode, latitude, longitude } =
          feature.properties as {
            name: string;
            region: string;
            department: string;
            inseeCode: string;
            latitude: number;
            longitude: number;
          };

        new mapboxgl.Popup()
          .setLngLat(coordinates as [number, number])
          .setHTML(
            `
              <div class="marker-popup">
                <div class="marker-popup-image"></div>
                <div>
                  <a href="/search?insee=${inseeCode}&latitude=${latitude}&longitude=${longitude}" target="_blank" class="marker-popup-title">${name}</a>
                  <p class="marker-popup-price">${region} - ${department}</p>
                </div>
              </div>
            `
          )
          .addTo(map);
      });

      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });
      map.on("mouseenter", "unclustered-point", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "unclustered-point", () => {
        map.getCanvas().style.cursor = "";
      });

      let selectedCityMarker: mapboxgl.Marker | null = null;
      map.on("click", async (e) => {
        // if click was on an existing marker/cluster, no action
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["unclustered-point", "clusters"],
        });
        if (features.length > 0) return;

        const { lng, lat } = e.lngLat;
        try {
          const result = await dispatch(
            getCity.initiate({
              latitude: lat,
              longitude: lng,
            })
          ).unwrap();
          const city = result;
          if (!city) return;

          const coordinates: [number, number] = [
            city.longitudeMairie!,
            city.latitudeMairie!,
          ];

          const alreadyExists =
            cities.find((c) => c.codeInsee === city.codeInsee) !== undefined;

          if (alreadyExists) return;

          // Remove previous marker if exists
          if (selectedCityMarker) {
            selectedCityMarker.remove();
          }

          // Add new marker
          selectedCityMarker = new mapboxgl.Marker({ color: "red" })
            .setLngLat(coordinates)
            .setPopup(
              new mapboxgl.Popup().setHTML(
                `
            <div class="marker-popup">
              <div class="marker-popup-image"></div>
              <div>
                <a href="/search?insee=${city.codeInsee}&latitude=${coordinates[1]}&longitude=${coordinates[0]}" target="_blank" class="marker-popup-title">${city.nomStandard}</a>
                <p class="marker-popup-price">${city.regNom} - ${city.depNom}</p>
              </div>
            </div>
          `
              )
            )
            .addTo(map);

          selectedCityMarker.togglePopup();
          map.flyTo({ center: coordinates, zoom: 10 });
        } catch (error: unknown) {
          return console.error("Failed to fetch city:", error);
        }
      });

      // Highlight Region - Black
      if (filters.region) {
        try {
          const geojson = await fetch("/regions-avec-outre-mer.geojson").then(
            (res) => res.json()
          );
          const matchedRegion = geojson.features.find(
            (f: any) => f.properties.nom === filters.region
          );
          if (matchedRegion) {
            map.addSource("highlight-region", {
              type: "geojson",
              data: matchedRegion,
            });
            map.addLayer({
              id: "highlight-region-fill",
              type: "fill",
              source: "highlight-region",
              paint: {
                "fill-color": "#000000",
                "fill-opacity": 0.15,
              },
            });
            map.addLayer({
              id: "highlight-region-outline",
              type: "line",
              source: "highlight-region",
              paint: {
                "line-color": "#000000",
                "line-width": 2,
              },
            });
          }
        } catch (err) {
          console.error("Failed to load region highlight:", err);
        }
      }
      // Highlight Department - Blue
      if (filters.department) {
        try {
          const geojson = await fetch(
            "/departements-avec-outre-mer.geojson"
          ).then((res) => res.json());
          const matchedDepartment = geojson.features.find(
            (f: any) => f.properties.nom === filters.department
          );
          if (matchedDepartment) {
            map.addSource("highlight-department", {
              type: "geojson",
              data: matchedDepartment,
            });
            map.addLayer({
              id: "highlight-department-fill",
              type: "fill",
              source: "highlight-department",
              paint: {
                "fill-color": "#0000FF",
                "fill-opacity": 0.15,
              },
            });
            map.addLayer({
              id: "highlight-department-outline",
              type: "line",
              source: "highlight-department",
              paint: {
                "line-color": "#0000FF",
                "line-width": 2,
              },
            });
          }
        } catch (err) {
          console.error("Failed to load department highlight:", err);
        }
      }
      // Highlight Academie - Red
      if (filters.academie) {
        try {
          const academieData = await fetch("/academies-2020.json").then((res) =>
            res.json()
          );
          const matchedAcademie = academieData.find(
            (a: any) => a.name === filters.academie
          );
          if (matchedAcademie) {
            const feature: Feature = {
              type: "Feature",
              geometry: matchedAcademie.geo_shape.geometry as Geometry,
              properties: {
                name: matchedAcademie.name,
              },
            };
            map.addSource("highlight-academie", {
              type: "geojson",
              data: feature,
            });
            map.addLayer({
              id: "highlight-academie-fill",
              type: "fill",
              source: "highlight-academie",
              paint: {
                "fill-color": "#FF0000",
                "fill-opacity": 0.15,
              },
            });
            map.addLayer({
              id: "highlight-academie-outline",
              type: "line",
              source: "highlight-academie",
              paint: {
                "line-color": "#FF0000",
                "line-width": 2,
              },
            });
          }
        } catch (err) {
          console.error("Failed to load academie highlight:", err);
        }
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [
    isLoading,
    isError,
    cities,
    filters.latitude,
    filters.longitude,
    filters.region,
    filters.department,
    filters.academie,
    dispatch,
  ]);

  useEffect(() => {
    if (!mapRef.current || !mapContainerRef.current) return;
    if (sidebarOpen === false || descriptionOpen == false) {
      const timeout = setTimeout(() => {
        mapRef.current?.resize();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [sidebarOpen, descriptionOpen]);

  if (isLoading) return <>Loading...</>;
  if (isError || !cities) return <div>Failed to fetch cities</div>;

  return (
    <div className="basis-5/12 grow relative rounded-xl">
      <div
        ref={mapContainerRef}
        className="map-container rounded-xl"
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
};

export default Map;
