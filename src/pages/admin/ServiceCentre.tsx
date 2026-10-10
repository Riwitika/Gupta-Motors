import React from 'react';

export const ServiceCentre: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-stone-300 pb-4">
        <h1 className="text-xl font-bold text-charcoal-900 tracking-tight">Workshop & Service Centre</h1>
        <p className="text-xs text-charcoal-500 mt-0.5">
          Job cards, technician assignment, repair estimation, and vehicle delivery tracking.
        </p>
      </div>

      <div className="bg-white border border-stone-300 p-6 rounded-sm space-y-3">
        <h2 className="text-sm font-semibold text-charcoal-800">
          Service Centre Operations Placeholder
        </h2>
        <p className="text-xs text-charcoal-600 leading-relaxed">
          Job card creation, service bay dispatch, mechanic logs, and repair completion workflows will be connected in future development phases.
        </p>
      </div>
    </div>
  );
};
