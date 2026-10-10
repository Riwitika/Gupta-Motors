import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Wrench, Package, UserCheck, MapPin, PhoneCall } from 'lucide-react';
import { DEALERSHIP_INFO } from '../../constants/business';
import { useLanguage } from '../../context/LanguageContext';

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-borderBase pb-6">
        <div className="text-xs text-charcoal-500 mb-2">
          <Link to="/" className="hover:text-charcoal-900">{t.nav.home}</Link> / <span>{t.nav.about}</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal-950">
          {t.about.title}
        </h1>
        <p className="text-sm text-charcoal-600 mt-2 max-w-2xl leading-relaxed">
          {t.about.subtitle}
        </p>
      </div>

      {/* Leadership & Introduction */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Main Editorial Text */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-white border border-borderBase p-6 sm:p-8 rounded-sm space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-crimson-700">
              <UserCheck className="w-5 h-5" />
              <h2 className="font-heading text-xl font-bold text-charcoal-950">
                {t.about.ownerHeading}
              </h2>
            </div>
            <p className="text-sm text-charcoal-700 leading-relaxed">
              {t.about.ownerBody}
            </p>
            <div className="pt-2 border-t border-borderBase flex items-center gap-3">
              <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
                Proprietor:
              </span>
              <span className="text-sm font-bold text-charcoal-900">
                {DEALERSHIP_INFO.owner}
              </span>
            </div>
          </div>

          <div className="bg-white border border-borderBase p-6 sm:p-8 rounded-sm space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-crimson-700">
              <MapPin className="w-5 h-5" />
              <h2 className="font-heading text-xl font-bold text-charcoal-950">
                {t.about.locationHeading}
              </h2>
            </div>
            <p className="text-sm text-charcoal-700 leading-relaxed">
              {t.about.locationBody}
            </p>
            <div className="text-xs text-charcoal-600 bg-ivory-50 p-3 border border-borderBase rounded-sm">
              <span className="font-bold text-charcoal-900">Address: </span>
              {DEALERSHIP_INFO.address.full}
            </div>
          </div>
        </div>

        {/* Business Scope & Verification Credentials */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-ivory-100 border border-borderBase p-6 rounded-sm space-y-4">
            <h3 className="font-heading text-lg font-bold text-charcoal-950 border-b border-borderBase pb-2">
              {t.about.servicesHeading}
            </h3>

            <div className="space-y-4 text-xs text-charcoal-700">
              <div className="flex gap-3">
                <div className="p-2 bg-white border border-borderBase text-crimson-700 rounded-sm h-fit">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-charcoal-900 mb-0.5">Motorcycle Sales</h4>
                  <p className="leading-relaxed">{t.about.salesPoint}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-white border border-borderBase text-crimson-700 rounded-sm h-fit">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-charcoal-900 mb-0.5">Workshop Service</h4>
                  <p className="leading-relaxed">{t.about.servicePoint}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-white border border-borderBase text-crimson-700 rounded-sm h-fit">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-charcoal-900 mb-0.5">Genuine Spares</h4>
                  <p className="leading-relaxed">{t.about.sparesPoint}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact Box */}
          <div className="bg-charcoal-950 text-white p-6 rounded-sm space-y-3">
            <h4 className="font-heading text-base font-bold text-ivory-50">
              Have a Direct Question?
            </h4>
            <p className="text-xs text-charcoal-300 leading-relaxed">
              Contact Vishal Gupta directly for new bike enquiries or service appointments.
            </p>
            <a
              href={DEALERSHIP_INFO.contact.phoneHref}
              className="btn-base w-full py-2.5 bg-crimson-700 hover:bg-crimson-800 text-white font-medium text-xs flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              Call {DEALERSHIP_INFO.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
