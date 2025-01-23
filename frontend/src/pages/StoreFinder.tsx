import React, { useState, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import type { Store } from '../types';
import { Header } from '../components/Header';
import { Map } from '../components/Map';
import { SearchBar } from '../components/SearchBar';
import { StoreList } from '../components/StoreList';

export default function StoreFinder() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 19.0760, // Mumbai coordinates
    lng: 72.8777,
  });
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [googleApi, setGoogleApi] = useState<typeof google | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showCurrentLocation, setShowCurrentLocation] = useState(false);

  useEffect(() => {
    const loadGoogleMapsApi = async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        
        if (!apiKey) {
          throw new Error('Google Maps API key is not configured');
        }

        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places'],
        });

        const google = await loader.load();
        setGoogleApi(google);
      } catch (error) {
        console.error('Failed to load Google Maps API:', error);
        setApiError('Failed to load Google Maps. Please check API key configuration.');
      }
    };

    loadGoogleMapsApi();
  }, []);

  const searchNearbyStores = async (location: { lat: number; lng: number }, googleInstance: typeof google, searchQuery?: string) => {
    try {
      setLoading(true);
      const service = new googleInstance.maps.places.PlacesService(document.createElement('div'));

      if (searchQuery) {
        const textSearchRequest = {
          query: searchQuery,
          location: new googleInstance.maps.LatLng(location.lat, location.lng),
          radius: 100000,
        };

        service.textSearch(textSearchRequest, (results, status) => {
          if (status === googleInstance.maps.places.PlacesServiceStatus.OK && results) {
            setStores(
              results.map((place) => ({
                id: place.place_id!,
                name: place.name!,
                address: place.formatted_address!,
                rating: place.rating,
                types: place.types!,
                vicinity: place.formatted_address!,
                geometry: {
                  location: {
                    lat: place.geometry!.location!.lat(),
                    lng: place.geometry!.location!.lng(),
                  },
                },
              }))
            );
          } else {
            setStores([]);
          }
          setLoading(false);
        });
      } else {
        const nearbySearchRequest = {
          location: new googleInstance.maps.LatLng(location.lat, location.lng),
          radius: 10000,
          keyword: 'sustainable store',
          type: ['establishment'],
        };

        service.nearbySearch(nearbySearchRequest, (results, status) => {
          if (status === googleInstance.maps.places.PlacesServiceStatus.OK && results) {
            setStores(
              results.map((place) => ({
                id: place.place_id!,
                name: place.name!,
                address: place.vicinity!,
                rating: place.rating,
                types: place.types!,
                vicinity: place.vicinity!,
                geometry: {
                  location: {
                    lat: place.geometry!.location!.lat(),
                    lng: place.geometry!.location!.lng(),
                  },
                },
              }))
            );
          } else {
            setStores([]);
          }
          setLoading(false);
        });
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      setLoading(false);
      setStores([]);
    }
  };

  const handleSearch = (location: { lat: number; lng: number }, searchQuery?: string) => {
    setCurrentLocation(location);
    setSelectedStore(null);
    setShowCurrentLocation(false);
    if (googleApi) {
      searchNearbyStores(location, googleApi, searchQuery);
    }
  };

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    setCurrentLocation(store.geometry.location);
  };

  if (apiError) {
    return <div className="text-center p-4 text-red-500">{apiError}</div>;
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <Header />
      <main className="container mx-auto p-4">
        <div className="flex flex-col gap-6">
          <div className="w-full">
            {googleApi && <SearchBar onSearch={handleSearch} googleApi={googleApi} />}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-6">
            <div className="space-y-4">
              <StoreList
                stores={stores}
                loading={loading}
                onStoreSelect={handleStoreSelect}
                selectedStore={selectedStore}
              />
            </div>
            <div className="h-[600px] rounded-xl overflow-hidden border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
              {googleApi && (
                <Map
                  center={currentLocation}
                  zoom={13}
                  stores={stores}
                  googleApi={googleApi}
                  selectedStore={selectedStore}
                  showCurrentLocation={showCurrentLocation}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}