import React from 'react';
import type { Store } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Star } from 'lucide-react';

interface StoreListProps {
  stores: Store[];
  loading: boolean;
  onStoreSelect: (store: Store) => void;
  selectedStore: Store | null;
}

export function StoreList({ stores, loading, onStoreSelect, selectedStore }: StoreListProps) {
  if (loading) {
    return <div className="text-center p-4">Searching for sustainable stores...</div>;
  }

  if (stores.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          No sustainable stores found in this area. Try searching in a different location.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {stores.map((store) => (
        <Card
          key={store.id}
          className={`cursor-pointer hover:bg-accent/5 ${
            selectedStore?.id === store.id ? 'border-primary' : ''
          }`}
          onClick={() => onStoreSelect(store)}
        >
          <CardHeader>
            <CardTitle className="text-lg">{store.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 shrink-0" />
              <p>{store.vicinity}</p>
            </div>
            {store.rating && (
              <div className="flex items-center gap-2 mt-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>{store.rating} / 5</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}