import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Phone, MapPin, Clock, Shield, Menu, X } from 'lucide-react';
import { DEALERSHIP_INFO, PUBLIC_NAV_LINKS } from '../../constants/business';

export const PublicLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50 text-charcoal-800">
      {/* Top Utility Bar */}
      <div className="bg-charcoal-950 text-charcoal-300 text-xs border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-charcoal-200">
              <MapPin className="w-3.5 h-3.5 text-crimson-600" />
              <span>{DEALERSHIP_INFO.address.full}</span>
            </span>
            <span className="hidden sm:inline-block text-charcoal-600">|</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-charcoal-400" />
              <span>{DEALERSHIP_INFO.operatingHours.days}: {DEALERSHIP_INFO.operatingHours.timing}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={DEALERSHIP_INFO.contact.phoneHref}
              className="flex items-center gap-1.5 text-charcoal-100 hover:text-white font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-crimson-600" />
              <span>{DEALERSHIP_INFO.contact.displayPhone}</span>
            </a>
            <span className="text-charcoal-700">|</span>
            <Link
              to="/login"
              className="flex items-center gap-1 text-charcoal-400 hover:text-charcoal-200 transition-colors"
            >
              <Shield className="w-3 h-3 text-crimson-700" />
              <span>Employee Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Brand & Navigation Header */}
      <header className="bg-ivory-50 border-b border-borderBase sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Brand Logo & Dealership Identity */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-charcoal-900 border border-charcoal-800 flex items-center justify-center rounded-sm">
                <span className="font-heading font-bold text-lg text-ivory-50 tracking-wider">GM</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-2xl font-bold tracking-tight text-charcoal-900 group-hover:text-crimson-700 transition-colors">
                    {DEALERSHIP_INFO.name}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-crimson-700 bg-crimson-50 px-1.5 py-0.5 border border-crimson-100 rounded-sm">
                    Kurawali
                  </span>
                </div>
                <span className="text-[11px] text-charcoal-500 font-medium tracking-wide">
                  Motorcycle Dealership & Authorised Service Centre • Est. {DEALERSHIP_INFO.establishedYear}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {PUBLIC_NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium tracking-tight rounded-sm transition-colors ${
                      isActive
                        ? 'text-crimson-700 bg-ivory-200 border-b-2 border-crimson-700'
                        : 'text-charcoal-700 hover:text-charcoal-950 hover:bg-ivory-100'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Direct Booking CTA */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/service-booking"
                className="btn-base px-4 py-2 bg-crimson-700 hover:bg-crimson-800 text-white font-medium tracking-tight border border-crimson-800 shadow-sm"
              >
                Book Service
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-charcoal-700 hover:text-charcoal-900 hover:bg-ivory-200 rounded-sm"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-borderBase bg-ivory-100 px-4 pt-2 pb-4 space-y-1">
            {PUBLIC_NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 text-base font-medium rounded-sm ${
                    isActive
                      ? 'text-crimson-700 bg-ivory-200 font-semibold'
                      : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-ivory-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-borderBase flex flex-col gap-2">
              <Link
                to="/service-booking"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-base w-full py-2.5 bg-crimson-700 text-white text-center font-medium"
              >
                Book Service
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-base w-full py-2 bg-ivory-200 text-charcoal-800 border border-borderBase text-center text-sm"
              >
                Staff Login
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Persistent Business Footer */}
      <footer className="bg-charcoal-950 text-charcoal-400 border-t border-charcoal-900 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Dealership Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg text-ivory-50">GUPTA MOTORS</span>
              </div>
              <p className="text-xs text-charcoal-400 leading-relaxed">
                Authorized multi-category motorcycle sales, genuine spare parts store, and factory-standard maintenance service facility.
              </p>
              <p className="text-xs text-charcoal-300">
                <span className="text-charcoal-500">Proprietor:</span> {DEALERSHIP_INFO.owner}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-semibold text-ivory-100 uppercase tracking-wider mb-3">Customer Services</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/bikes" className="hover:text-ivory-100 transition-colors">Motorcycle Catalogue</Link></li>
                <li><Link to="/service-booking" className="hover:text-ivory-100 transition-colors">Schedule Periodic Maintenance</Link></li>
                <li><Link to="/spare-parts" className="hover:text-ivory-100 transition-colors">Genuine Spares Enquiry</Link></li>
                <li><Link to="/offers" className="hover:text-ivory-100 transition-colors">Seasonal Finance & Offers</Link></li>
              </ul>
            </div>

            {/* Dealership Location */}
            <div>
              <h4 className="text-xs font-semibold text-ivory-100 uppercase tracking-wider mb-3">Dealership Facility</h4>
              <p className="text-xs text-charcoal-400 leading-relaxed">
                {DEALERSHIP_INFO.address.line1}<br />
                {DEALERSHIP_INFO.address.city}, {DEALERSHIP_INFO.address.state} — {DEALERSHIP_INFO.address.pincode}
              </p>
              <p className="text-xs text-charcoal-300 mt-2">
                <span className="text-charcoal-500">Working Hours:</span><br />
                {DEALERSHIP_INFO.operatingHours.days}<br />
                {DEALERSHIP_INFO.operatingHours.timing}
              </p>
            </div>

            {/* Contact & Support */}
            <div>
              <h4 className="text-xs font-semibold text-ivory-100 uppercase tracking-wider mb-3">Direct Support</h4>
              <p className="text-xs text-charcoal-400 leading-relaxed mb-2">
                Speak directly with our sales or service advisors:
              </p>
              <a
                href={DEALERSHIP_INFO.contact.phoneHref}
                className="inline-block text-base font-semibold text-ivory-100 hover:text-crimson-500 tracking-wide transition-colors"
              >
                {DEALERSHIP_INFO.contact.displayPhone}
              </a>
              <div className="mt-4 pt-3 border-t border-charcoal-800">
                <Link
                  to="/login"
                  className="text-xs text-charcoal-400 hover:text-ivory-200 flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-crimson-600" />
                  Staff Internal Access
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-charcoal-900 flex flex-col sm:flex-row justify-between items-center text-xs text-charcoal-500 gap-2">
            <p>© {new Date().getFullYear()} Gupta Motors. All rights reserved.</p>
            <p className="text-charcoal-400">{DEALERSHIP_INFO.address.full}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
