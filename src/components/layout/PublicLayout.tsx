import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Phone, MapPin, Shield, Menu, X, MessageSquare, Globe, Navigation } from 'lucide-react';
import { DEALERSHIP_INFO, PUBLIC_NAV_LINKS } from '../../constants/business';
import { useLanguage } from '../../context/LanguageContext';

export const PublicLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50 text-charcoal-800">
      {/* Top Utility Bar */}
      <div className="bg-charcoal-950 text-charcoal-300 text-xs border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap justify-between items-center gap-2">
          {/* Location & Announcement */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-charcoal-200">
              <MapPin className="w-3.5 h-3.5 text-crimson-600 flex-shrink-0" />
              <span>{DEALERSHIP_INFO.address.line1}, {DEALERSHIP_INFO.address.city}</span>
            </span>
            <span className="hidden md:inline-block text-charcoal-700">|</span>
            <span className="hidden md:inline-block text-charcoal-400">
              {t.topBar.strip}
            </span>
          </div>

          {/* Quick Actions & Language Toggle */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-charcoal-900 border border-charcoal-800 px-2 py-0.5 rounded-sm">
              <Globe className="w-3 h-3 text-crimson-500" />
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`text-[11px] px-1.5 py-0.5 rounded-sm font-medium transition-colors ${
                  language === 'en'
                    ? 'bg-crimson-700 text-white'
                    : 'text-charcoal-400 hover:text-white'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <span className="text-charcoal-700 text-[10px]">/</span>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`text-[11px] px-1.5 py-0.5 rounded-sm font-medium transition-colors ${
                  language === 'hi'
                    ? 'bg-crimson-700 text-white'
                    : 'text-charcoal-400 hover:text-white'
                }`}
                aria-label="हिंदी में बदलें"
              >
                हिन्दी
              </button>
            </div>

            {/* Direct WhatsApp link */}
            <a
              href={DEALERSHIP_INFO.contact.whatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.topBar.whatsApp}</span>
            </a>

            {/* Direct Phone link */}
            <a
              href={DEALERSHIP_INFO.contact.phoneHref}
              className="flex items-center gap-1.5 text-charcoal-100 hover:text-white font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-crimson-600" />
              <span>{DEALERSHIP_INFO.contact.phone}</span>
            </a>

            <span className="text-charcoal-700">|</span>

            {/* Internal Staff Login */}
            <Link
              to="/login"
              className="flex items-center gap-1 text-charcoal-400 hover:text-charcoal-200 transition-colors"
            >
              <Shield className="w-3 h-3 text-crimson-700" />
              <span className="hidden sm:inline">{t.nav.employeePortal}</span>
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
              <div className="w-11 h-11 bg-charcoal-900 border border-charcoal-800 flex items-center justify-center rounded-sm">
                <span className="font-heading font-bold text-lg text-ivory-50 tracking-wider">GM</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-2xl font-bold tracking-tight text-charcoal-950 group-hover:text-crimson-700 transition-colors">
                    {DEALERSHIP_INFO.name}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-crimson-800 bg-crimson-50 px-1.5 py-0.5 border border-crimson-100 rounded-sm">
                    {DEALERSHIP_INFO.address.city}
                  </span>
                </div>
                <span className="text-[11px] text-charcoal-600 font-medium tracking-wide">
                  Bajaj Motorcycles • Sales, Servicing & Genuine Spares
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
              {PUBLIC_NAV_LINKS.map((link) => {
                const label = t.nav[link.key as keyof typeof t.nav];
                return (
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
                    {label}
                  </NavLink>
                );
              })}
            </nav>

            {/* Direct Booking CTA & Mobile Language Switch */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/service-booking"
                className="btn-base px-4 py-2 bg-crimson-700 hover:bg-crimson-800 text-white font-medium tracking-tight border border-crimson-800 shadow-sm"
              >
                {t.nav.bookService}
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-charcoal-700 hover:text-charcoal-900 hover:bg-ivory-200 rounded-sm"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-borderBase bg-ivory-100 px-4 pt-3 pb-5 space-y-2">
            {/* Mobile Language Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-borderBase">
              <span className="text-xs font-semibold text-charcoal-600">Language / भाषा:</span>
              <div className="flex items-center gap-1 bg-white border border-borderBase px-2 py-1 rounded-sm">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`text-xs px-2 py-0.5 rounded-sm font-medium ${
                    language === 'en' ? 'bg-crimson-700 text-white' : 'text-charcoal-700'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`text-xs px-2 py-0.5 rounded-sm font-medium ${
                    language === 'hi' ? 'bg-crimson-700 text-white' : 'text-charcoal-700'
                  }`}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            {PUBLIC_NAV_LINKS.map((link) => {
              const label = t.nav[link.key as keyof typeof t.nav];
              return (
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
                  {label}
                </NavLink>
              );
            })}

            <div className="pt-3 border-t border-borderBase flex flex-col gap-2">
              <Link
                to="/service-booking"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-base w-full py-2.5 bg-crimson-700 text-white text-center font-medium"
              >
                {t.nav.bookService}
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={DEALERSHIP_INFO.contact.phoneHref}
                  className="btn-base py-2 bg-charcoal-900 text-ivory-50 text-center text-xs font-medium flex items-center justify-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {t.topBar.callNow}
                </a>
                <a
                  href={DEALERSHIP_INFO.contact.whatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base py-2 bg-emerald-700 text-white text-center text-xs font-medium flex items-center justify-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </div>
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
                <span className="text-[10px] font-bold uppercase tracking-wider text-crimson-400 bg-crimson-900/50 px-1.5 py-0.5 rounded-sm">
                  Bajaj
                </span>
              </div>
              <p className="text-xs text-charcoal-400 leading-relaxed">
                {t.footer.tagline}
              </p>
              <p className="text-xs text-charcoal-300 font-medium">
                {t.footer.owner}
              </p>
              <div className="pt-1">
                <a
                  href={DEALERSHIP_INFO.maps.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-crimson-400 hover:text-crimson-300"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{t.contact.directionsBtn}</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-semibold text-ivory-100 uppercase tracking-wider mb-3">
                {t.footer.quickLinks}
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/bikes" className="hover:text-ivory-100 transition-colors">{t.nav.bikes}</Link></li>
                <li><Link to="/service-booking" className="hover:text-ivory-100 transition-colors">{t.nav.service}</Link></li>
                <li><Link to="/spare-parts" className="hover:text-ivory-100 transition-colors">{t.nav.spares}</Link></li>
                <li><Link to="/offers" className="hover:text-ivory-100 transition-colors">{t.nav.offers}</Link></li>
                <li><Link to="/about" className="hover:text-ivory-100 transition-colors">{t.nav.about}</Link></li>
                <li><Link to="/contact" className="hover:text-ivory-100 transition-colors">{t.nav.contact}</Link></li>
              </ul>
            </div>

            {/* Dealership Location */}
            <div>
              <h4 className="text-xs font-semibold text-ivory-100 uppercase tracking-wider mb-3">
                {t.contact.visitTitle}
              </h4>
              <p className="text-xs text-charcoal-400 leading-relaxed">
                {DEALERSHIP_INFO.address.full}
              </p>
              <div className="mt-3 text-xs text-charcoal-300 space-y-1">
                <p><span className="text-charcoal-500">District:</span> Mainpuri, Uttar Pradesh</p>
                <p><span className="text-charcoal-500">Highway:</span> Grand Trunk (G.T.) Road</p>
              </div>
            </div>

            {/* Direct Support */}
            <div>
              <h4 className="text-xs font-semibold text-ivory-100 uppercase tracking-wider mb-3">
                {t.footer.contactInfo}
              </h4>
              <p className="text-xs text-charcoal-400 leading-relaxed mb-2">
                {t.contact.callDesc}
              </p>
              <div className="space-y-2">
                <a
                  href={DEALERSHIP_INFO.contact.phoneHref}
                  className="inline-flex items-center gap-1.5 text-base font-semibold text-ivory-100 hover:text-crimson-400 tracking-wide transition-colors"
                >
                  <Phone className="w-4 h-4 text-crimson-500" />
                  <span>{DEALERSHIP_INFO.contact.displayPhone}</span>
                </a>
                <div>
                  <a
                    href={DEALERSHIP_INFO.contact.whatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{t.contact.whatsAppBtn}</span>
                  </a>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-charcoal-800">
                <Link
                  to="/login"
                  className="text-xs text-charcoal-500 hover:text-ivory-200 flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-crimson-700" />
                  {t.nav.employeePortal}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-charcoal-900 flex flex-col sm:flex-row justify-between items-center text-xs text-charcoal-500 gap-2">
            <p>© {new Date().getFullYear()} {t.footer.copyright}</p>
            <p className="text-charcoal-400">{DEALERSHIP_INFO.address.line1}, {DEALERSHIP_INFO.address.city}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
