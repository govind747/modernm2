'use client';

import { ProductSpecification } from '@/lib/types/database';
import { Check, Package, Ruler, Weight, Battery, Clock, Droplet, Thermometer } from 'lucide-react';

interface ProductSpecificationsProps {
  specifications: ProductSpecification[];
}

const getIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('weight')) return Weight;
  if (lowerName.includes('size') || lowerName.includes('dimension')) return Ruler;
  if (lowerName.includes('battery')) return Battery;
  if (lowerName.includes('warranty')) return Clock;
  if (lowerName.includes('material')) return Package;
  if (lowerName.includes('water') || lowerName.includes('liquid')) return Droplet;
  if (lowerName.includes('temp')) return Thermometer;
  return Check;
};

export function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Product Specifications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specifications.map((spec) => {
          const Icon = getIcon(spec.specification_name);
          return (
            <div
              key={spec.id}
              className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Icon className="h-5 w-5 text-brand-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600">{spec.specification_name}</p>
                <p className="text-base font-medium text-slate-900">{spec.specification_value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}