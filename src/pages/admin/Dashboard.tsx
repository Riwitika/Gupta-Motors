import React from 'react';
import { DEALERSHIP_INFO } from '../../constants/business';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="border-b border-stone-300 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-charcoal-900 tracking-tight">Executive Dashboard</h1>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Dealership Operations Overview • {DEALERSHIP_INFO.name} ({DEALERSHIP_INFO.address.city})
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 bg-stone-200 text-charcoal-700 font-medium rounded-sm border border-stone-300">
              Branch: Kurawali Showroom
            </span>
          </div>
        </div>
      </div>

      {/* Structured Placeholder Notice */}
      <div className="bg-white border border-stone-300 p-6 rounded-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
          <h2 className="text-sm font-semibold text-charcoal-900 uppercase tracking-wider">
            Operational Dashboard Module Placeholder
          </h2>
        </div>
        <p className="text-xs text-charcoal-600 leading-relaxed">
          This back-office module will display verified KPIs across sales conversion, service bay utilization, and inventory turns upon backend and database schema deployment.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm">
            <span className="text-[11px] font-semibold text-charcoal-500 uppercase">Sales Pipeline</span>
            <div className="mt-1 text-xs text-charcoal-700">Awaiting CRM module integration</div>
          </div>
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm">
            <span className="text-[11px] font-semibold text-charcoal-500 uppercase">Service Centre</span>
            <div className="mt-1 text-xs text-charcoal-700">Awaiting Job Card module integration</div>
          </div>
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm">
            <span className="text-[11px] font-semibold text-charcoal-500 uppercase">Parts Inventory</span>
            <div className="mt-1 text-xs text-charcoal-700">Awaiting SKU ledger integration</div>
          </div>
        </div>
      </div>
    </div>
  );
};
