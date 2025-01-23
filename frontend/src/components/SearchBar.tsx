import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface SearchBarProps {
  onSearch: (location: { lat: number; lng: number }) => void;
  googleApi: typeof google;
}

const searchSuggestions = [
  'zero waste stores near me',
  'waste store near me',
  'refill stations near me',
  'ethical shops near me',
];

export function SearchBar({ onSearch, googleApi }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const inputElement = document.getElementById('search-input') as HTMLInputElement;
    if (inputElement) {
      const autocomplete = new googleApi.maps.places.Autocomplete(inputElement, {
        types: ['geocode'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          onSearch({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }
      });
    }
  }, [googleApi, onSearch]);

  const handleSearch = async (searchQuery: string) => {
    try {
      const service = new googleApi.maps.places.PlacesService(
        document.createElement('div')
      );

      const request = {
        query: searchQuery,
        fields: ['name', 'geometry'],
      };

      service.findPlaceFromQuery(request, (results, status) => {
        if (status === googleApi.maps.places.PlacesServiceStatus.OK && results) {
          const location = results[0].geometry?.location;
          if (location) {
            onSearch({ lat: location.lat(), lng: location.lng() });
          }
        }
      });
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <div className="flex gap-2 w-full">
        <Input
          id="search-input"
          placeholder="Search for eco-friendly stores near you..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          className="flex-1 h-12 px-4 rounded-xl border-2 border-[#151616] focus:ring-2 focus:ring-[#D6F32F] focus:border-[#151616] transition-all text-base"
        />
        <Button 
          onClick={() => handleSearch(query)}
          className="h-12 px-6 bg-[#D6F32F] border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] hover:shadow-[2px_2px_0px_0px_#151616] hover:translate-y-[2px] hover:translate-x-[2px] transition-all rounded-xl whitespace-nowrap"
        >
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>
      </div>

      {showSuggestions && (
        <Card className="absolute w-full mt-2 z-10 border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] rounded-xl overflow-hidden">
          <ul className="p-2 space-y-1">
            {searchSuggestions.map((suggestion) => (
              <li
                key={suggestion}
                className="p-3 hover:bg-[#D6F32F]/10 rounded-lg cursor-pointer transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}