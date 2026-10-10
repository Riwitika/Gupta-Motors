import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowLeft } from 'lucide-react';
import { DEALERSHIP_INFO } from '../../constants/business';

export const EmployeeLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Real Supabase Auth will be wired in future prompt; navigating to admin dashboard for structure verification
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-charcoal-600 hover:text-charcoal-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dealership Website
        </Link>

        {/* Login Box */}
        <div className="bg-white border border-borderBase p-8 rounded-sm shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-charcoal-900 border border-charcoal-800 text-ivory-50 flex items-center justify-center mx-auto rounded-sm font-heading font-bold text-lg">
              GM
            </div>
            <h1 className="font-heading text-2xl font-bold text-charcoal-950">
              Employee Portal
            </h1>
            <p className="text-xs text-charcoal-500">
              Gupta Motors Internal Dealership & ERP Management System
            </p>
          </div>

          <form onSubmit={handlePreviewSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Staff Email or ID
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@guptamotors.com"
                className="w-full px-3 py-2 bg-ivory-50 border border-borderBase rounded-sm text-sm text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-1 focus:ring-crimson-700 focus:border-crimson-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-ivory-50 border border-borderBase rounded-sm text-sm text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-1 focus:ring-crimson-700 focus:border-crimson-700"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn-base w-full py-2.5 bg-crimson-700 hover:bg-crimson-800 text-white font-medium shadow-sm flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Sign In to Workstation
              </button>
            </div>
          </form>

          <div className="p-3 bg-ivory-100 border border-borderBase rounded-sm flex items-start gap-2 text-[11px] text-charcoal-600">
            <Shield className="w-4 h-4 text-crimson-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-charcoal-800">Authorized Personnel Only:</span>
              <p className="mt-0.5">
                Role-based access controls for Sales, Workshop, Inventory, and POS accounts. Contact {DEALERSHIP_INFO.owner} for credential resets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
