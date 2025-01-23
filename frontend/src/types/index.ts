// src/types/index.ts
export interface Store {
  id: string;
  name: string;
  address: string;
  rating?: number;
  types: string[];
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

export type StoreType = "zero_waste" | "refill_station" | "ethical_market" | "all";
