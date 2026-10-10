import React from 'react';

export const Inventory: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-stone-300 pb-4">
        <h1 className="text-xl font-bold text-charcoal-900 tracking-tight">Vehicle & Spares Inventory</h1>
        <p className="text-xs text-charcoal-500 mt-0.5">
          Motorcycle stock tracking by chassis/engine number and OEM spare parts ledger.
        </p>
      </div>

      <div className="bg-white border border-stone-300 p-6 rounded-sm space-y-3">
        <h2 className="text-sm font-semibold text-charcoal-800">
          Inventory Control Module Placeholder
        </h2>
        <p className="text-xs text-charcoal-600 leading-relaxed">
          Chassis number verification, spare parts stock-in/stock-out logging, low-inventory notifications, and supplier shipments will be implemented here.
        </p>
      </div>
    </div>
  );
};
