import React from 'react';

export const EmployeeManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-stone-300 pb-4">
        <h1 className="text-xl font-bold text-charcoal-900 tracking-tight">Staff & Role Management</h1>
        <p className="text-xs text-charcoal-500 mt-0.5">
          Employee onboarding, department permissions, technician assignments, and access control.
        </p>
      </div>

      <div className="bg-white border border-stone-300 p-6 rounded-sm space-y-3">
        <h2 className="text-sm font-semibold text-charcoal-800">
          Employee Management Module Placeholder
        </h2>
        <p className="text-xs text-charcoal-600 leading-relaxed">
          Staff profile records, operational roles (Sales Manager, Service Advisor, Mechanic, Cashier), and Supabase Auth identity mappings will be managed here.
        </p>
      </div>
    </div>
  );
};
