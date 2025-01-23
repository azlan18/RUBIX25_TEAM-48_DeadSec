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
    return <div className="text-center p-4 text-muted-foreground">Searching for stores...</div>;
  }

  if (stores.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Search for stores, places, or addresses above to find locations near you.
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-auto max-h-[500px]">
      {stores.map((store) => (
        <Card
          key={store.id}
          className={`cursor-pointer transition-colors ${
            selectedStore?.id === store.id ? "bg-primary/10" : "hover:bg-muted"
          }`}
          onClick={() => onStoreSelect(store)}
        >
          <CardHeader>
            <CardTitle className="text-lg">{store.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{store.vicinity}</span>
            </div>
            {store.rating && (
              <div className="flex items-center mt-2 text-sm">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>{store.rating} / 5</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}