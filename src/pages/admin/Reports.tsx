import React from 'react';

export const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-stone-300 pb-4">
        <h1 className="text-xl font-bold text-charcoal-900 tracking-tight">Business Reports & Analytics</h1>
        <p className="text-xs text-charcoal-500 mt-0.5">
          Sales summaries, technician efficiency, spare part margins, and GST tax reports.
        </p>
      </div>

      <div className="bg-white border border-stone-300 p-6 rounded-sm space-y-3">
        <h2 className="text-sm font-semibold text-charcoal-800">
          Reports Module Placeholder
        </h2>
        <p className="text-xs text-charcoal-600 leading-relaxed">
          Aggregated analytics, revenue summaries, and downloadable audit reports will be generated once transaction history is established.
        </p>
      </div>
    </div>
  );
};
