import React, { useEffect, useRef } from 'react';
import type { MapProps, Store } from '../types';

interface ExtendedMapProps extends MapProps {
  stores: Store[];
  googleApi: typeof google;
  selectedStore: Store | null;
  showCurrentLocation: boolean;
}

export function Map({ center, zoom, stores, googleApi, selectedStore, showCurrentLocation }: ExtendedMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const currentLocationMarkerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!googleApi || !mapRef.current) return;

    if (!googleMapRef.current) {
      googleMapRef.current = new googleApi.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });
    }
  }, [googleApi, center, zoom]);

  useEffect(() => {
    if (googleMapRef.current) {
      googleMapRef.current.setCenter(center);
    }
  }, [center]);

  useEffect(() => {
    if (googleMapRef.current) {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      // Add new markers
      stores.forEach((store) => {
        const marker = new googleApi.maps.Marker({
          position: store.geometry.location,
          map: googleMapRef.current!,
          title: store.name,
          icon: selectedStore?.id === store.id 
            ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png" 
            : undefined,
        });

        const infoWindow = new googleApi.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-bold">${store.name}</h3>
              <p>${store.vicinity}</p>
              ${store.rating ? `<p>Rating: ${store.rating} / 5</p>` : ""}
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(googleMapRef.current!, marker);
        });

        markersRef.current.push(marker);
      });

      // Center on selected store if any
      if (selectedStore) {
        googleMapRef.current.setCenter(selectedStore.geometry.location);
        googleMapRef.current.setZoom(15);
      }
    }
  }, [stores, googleApi, selectedStore]);

  useEffect(() => {
    if (googleMapRef.current && showCurrentLocation) {
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setMap(null);
      }
      currentLocationMarkerRef.current = new googleApi.maps.Marker({
        position: center,
        map: googleMapRef.current,
        title: "Your Location",
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      });
      googleMapRef.current.setCenter(center);
      googleMapRef.current.setZoom(15);
    }
  }, [showCurrentLocation, center, googleApi]);

  return <div ref={mapRef} className="w-full h-full rounded-xl border-2 border-[#151616]" />;
}
