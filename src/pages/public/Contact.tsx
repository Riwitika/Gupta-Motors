import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, MessageSquare, Navigation, UserCheck } from 'lucide-react';
import { DEALERSHIP_INFO } from '../../constants/business';
import { useLanguage } from '../../context/LanguageContext';

export const Contact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-borderBase pb-6">
        <div className="text-xs text-charcoal-500 mb-2">
          <Link to="/" className="hover:text-charcoal-900">{t.nav.home}</Link> / <span>{t.nav.contact}</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal-950">
          {t.contact.title}
        </h1>
        <p className="text-sm text-charcoal-600 mt-2 max-w-2xl leading-relaxed">
          {t.contact.subtitle}
        </p>
      </div>

      {/* Main Contact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Phone Call Card */}
        <div className="bg-white border border-borderBase p-6 rounded-sm shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-ivory-100 border border-borderBase text-crimson-700 flex items-center justify-center rounded-sm">
              <Phone className="w-5 h-5" />
            </div>
            <h2 className="font-heading text-lg font-bold text-charcoal-950">
              {t.contact.callTitle}
            </h2>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              {t.contact.callDesc}
            </p>
            <div className="pt-2">
              <span className="text-lg font-bold text-charcoal-950 block">
                {DEALERSHIP_INFO.contact.displayPhone}
              </span>
              <span className="text-xs text-charcoal-500 font-medium">
                Proprietor: {DEALERSHIP_INFO.owner}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-borderBase">
            <a
              href={DEALERSHIP_INFO.contact.phoneHref}
              className="btn-base w-full py-2.5 bg-crimson-700 hover:bg-crimson-800 text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              {t.contact.callBtn}
            </a>
          </div>
        </div>

        {/* WhatsApp Card */}
        <div className="bg-white border border-borderBase p-6 rounded-sm shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center rounded-sm">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h2 className="font-heading text-lg font-bold text-charcoal-950">
              {t.contact.whatsAppTitle}
            </h2>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              {t.contact.whatsAppDesc}
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-sm border border-emerald-100 inline-block">
                Available on WhatsApp
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-borderBase">
            <a
              href={DEALERSHIP_INFO.contact.whatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              {t.contact.whatsAppBtn}
            </a>
          </div>
        </div>

        {/* Physical Showroom Card */}
        <div className="bg-white border border-borderBase p-6 rounded-sm shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-ivory-100 border border-borderBase text-charcoal-900 flex items-center justify-center rounded-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="font-heading text-lg font-bold text-charcoal-950">
              {t.contact.visitTitle}
            </h2>
            <p className="text-xs text-charcoal-700 leading-relaxed font-medium">
              {DEALERSHIP_INFO.address.full}
            </p>
            <p className="text-xs text-charcoal-500">
              Located on Grand Trunk Road in Kurawali, Mainpuri.
            </p>
          </div>

          <div className="pt-4 border-t border-borderBase">
            <a
              href={DEALERSHIP_INFO.maps.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base w-full py-2.5 bg-charcoal-900 hover:bg-black text-ivory-50 text-xs font-semibold border border-charcoal-800 shadow-sm flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4 text-crimson-500" />
              {t.contact.directionsBtn}
            </a>
          </div>
        </div>
      </div>

      {/* Verified Dealership Identity Footer Strip */}
      <div className="p-6 bg-ivory-100 border border-borderBase rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white border border-borderBase rounded-sm text-charcoal-800">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-charcoal-950">{DEALERSHIP_INFO.name}</span>
            <p className="text-charcoal-600">Proprietor: {DEALERSHIP_INFO.owner} • Kurawali, Mainpuri (U.P.)</p>
          </div>
        </div>

        <div className="text-charcoal-500 italic">
          Bajaj motorcycle sales, authorized servicing and genuine spare parts retail.
        </div>
      </div>
    </div>
  );
};
