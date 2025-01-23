import React from 'react';
import { Button } from './ui/button';
import type { StoreType } from '../types';

interface FilterBarProps {
  selectedType: StoreType;
  onTypeChange: (type: StoreType) => void;
}

export function FilterBar({ selectedType, onTypeChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant={selectedType === 'all' ? 'default' : 'outline'}
        onClick={() => onTypeChange('all')}
      >
        All Stores
      </Button>
      <Button 
        variant={selectedType === 'zero_waste' ? 'default' : 'outline'}
        onClick={() => onTypeChange('zero_waste')}
      >
        Zero Waste
      </Button>
      <Button 
        variant={selectedType === 'refill_station' ? 'default' : 'outline'}
        onClick={() => onTypeChange('refill_station')}
      >
        Refill Stations
      </Button>
      <Button 
        variant={selectedType === 'ethical_market' ? 'default' : 'outline'}
        onClick={() => onTypeChange('ethical_market')}
      >
        Ethical Markets
      </Button>
    </div>
  );
}
