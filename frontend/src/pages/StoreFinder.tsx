import React, { useState, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import type { Store } from '../types';
import { Header } from '../components/Header';
import { Map } from '../components/Map';
import { SearchBar } from '../components/SearchBar';
import { StoreList } from '../components/StoreList';
import { Button } from '../components/ui/button';
import { MapPin } from 'lucide-react';

export default function StoreFinder() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 51.5074,
    lng: -0.1278,
  });
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [googleApi, setGoogleApi] = useState<typeof google | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showCurrentLocation, setShowCurrentLocation] = useState(false);

  useEffect(() => {
    const loadGoogleMapsApi = async () => {
      try {
        const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
        console.log('Loading Google Maps with API key:', apiKey); // For debugging
        
        if (!apiKey) {
          throw new Error('Google Maps API key is not configured');
        }

        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places'],
          language: 'en',
        });

        const googleInstance = await loader.load();
        setGoogleApi(googleInstance);

        // Initial search with default location
        searchNearbyStores(currentLocation, googleInstance);
      } catch (error) {
        console.error('Failed to load Google Maps API:', error);
        setApiError('Failed to load Google Maps. Please check API key configuration.');
        setLoading(false);
      }
    };

    loadGoogleMapsApi();
  }, []);

  const searchNearbyStores = async (
    location: { lat: number; lng: number },
    googleInstance: typeof google
  ) => {
    try {
      setLoading(true);
      const service = new googleInstance.maps.places.PlacesService(
        document.createElement('div')
      );

      const request = {
        location: new googleInstance.maps.LatLng(location.lat, location.lng),
        radius: 5000,
        keyword: 'zero waste store refill ethical sustainable',
      };

      service.nearbySearch(request, (results, status) => {
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
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Error fetching nearby stores:', error);
      setLoading(false);
    }
  };

  const handleSearch = (location: { lat: number; lng: number }) => {
    setCurrentLocation(location);
    setSelectedStore(null);
    if (googleApi) {
      searchNearbyStores(location, googleApi);
    }
  };

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    setCurrentLocation(store.geometry.location);
  };

  const handleShowCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(location);
          setShowCurrentLocation(true);
          if (googleApi) {
            searchNearbyStores(location, googleApi);
          }
        },
        () => {
          console.log('Unable to retrieve your location');
          alert('Unable to retrieve your location. Please check your browser settings.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  if (apiError) {
    return <div className="text-center p-4 text-red-500">{apiError}</div>;
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <Header />
      <main className="container mx-auto p-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch w-full">
            <div className="flex-grow">
              {googleApi && <SearchBar onSearch={handleSearch} googleApi={googleApi} />}
            </div>
            <Button 
              onClick={handleShowCurrentLocation} 
              className="whitespace-nowrap h-12 px-6 bg-[#D6F32F] border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] hover:shadow-[2px_2px_0px_0px_#151616] hover:translate-y-[2px] hover:translate-x-[2px] transition-all rounded-xl"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Use My Location
            </Button>
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