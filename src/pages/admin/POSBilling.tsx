import React from 'react';

export const POSBilling: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-stone-300 pb-4">
        <h1 className="text-xl font-bold text-charcoal-900 tracking-tight">Point of Sale & Billing</h1>
        <p className="text-xs text-charcoal-500 mt-0.5">
          Counter sales, spare parts invoice generation, and workshop labour bills.
        </p>
      </div>

      <div className="bg-white border border-stone-300 p-6 rounded-sm space-y-3">
        <h2 className="text-sm font-semibold text-charcoal-800">
          POS & Billing Module Placeholder
        </h2>
        <p className="text-xs text-charcoal-600 leading-relaxed">
          GST-compliant retail invoicing, split payments, counter sales receipts, and workshop settlement billing will be built in the dedicated billing prompt.
        </p>
      </div>
    </div>
  );
};
