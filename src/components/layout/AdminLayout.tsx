import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Wrench,
  Boxes,
  Receipt,
  BarChart3,
  ShieldCheck,
  ExternalLink,
  Lock,
  LogOut
} from 'lucide-react';
import { DEALERSHIP_INFO } from '../../constants/business';

const adminNavItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Sales CRM & Leads', path: '/admin/sales-crm', icon: Users },
  { name: 'Service Centre', path: '/admin/service-centre', icon: Wrench },
  { name: 'Inventory & Spares', path: '/admin/inventory', icon: Boxes },
  { name: 'POS & Billing', path: '/admin/pos-billing', icon: Receipt },
  { name: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
  { name: 'Employee Management', path: '/admin/employees', icon: ShieldCheck },
];

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-100 text-charcoal-900 font-sans">
      {/* Top Back-Office Bar */}
      <header className="bg-charcoal-950 text-white border-b border-charcoal-800 h-14 flex items-center justify-between px-4 sm:px-6 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-crimson-700 flex items-center justify-center font-bold text-white text-sm rounded-sm">
            GM
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-semibold text-base tracking-wide text-ivory-50">
              {DEALERSHIP_INFO.name}
            </span>
            <span className="text-[11px] uppercase tracking-wider text-charcoal-400 font-mono">
              Dealership ERP
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-charcoal-900 border border-charcoal-800 rounded-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-charcoal-300">Staff Mode:</span>
            <span className="font-medium text-ivory-100">{DEALERSHIP_INFO.owner} (Admin)</span>
          </div>

          <Link
            to="/"
            className="flex items-center gap-1.5 text-charcoal-300 hover:text-white transition-colors px-2 py-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Public Website</span>
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-1 text-red-300 hover:text-red-200 transition-colors px-2 py-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </Link>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Dense Admin Sidebar */}
        <aside className="w-64 bg-white border-r border-stone-300 flex flex-col flex-shrink-0">
          <div className="p-3 bg-stone-50 border-b border-stone-200 text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
            Operational Modules
          </div>
          <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-sm transition-colors ${
                      isActive
                        ? 'bg-crimson-50 text-crimson-800 border-l-4 border-crimson-700 font-semibold'
                        : 'text-charcoal-700 hover:bg-stone-100 hover:text-charcoal-950'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="p-3 border-t border-stone-200 bg-stone-50 text-[11px] text-charcoal-500">
            <div className="flex items-center gap-1 text-charcoal-700 font-medium mb-1">
              <Lock className="w-3 h-3 text-crimson-700" />
              <span>Restricted Access</span>
            </div>
            <span>Branch: Kurawali, Mainpuri (U.P.)</span>
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 bg-stone-100 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
