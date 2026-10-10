import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall } from 'lucide-react';
import { DEALERSHIP_INFO } from '../../constants/business';

export const Offers: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-borderBase pb-6 mb-8">
        <div className="text-xs text-charcoal-500 mb-2">
          <Link to="/" className="hover:text-charcoal-900">Home</Link> / <span>Offers</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-charcoal-950">Festive & Seasonal Offers</h1>
        <p className="text-sm text-charcoal-600 mt-2 max-w-2xl">
          Verified dealership promotions, exchange bonuses, low down-payment schemes, and festive corporate discounts.
        </p>
      </div>

      <div className="bg-white border border-borderBase p-8 rounded-sm text-center max-w-xl mx-auto space-y-4">
        <div className="inline-block px-3 py-1 bg-crimson-50 text-crimson-800 border border-crimson-100 text-xs font-semibold uppercase tracking-wider rounded-sm">
          Gupta Motors Exclusive
        </div>
        <h2 className="font-heading text-xl font-bold text-charcoal-900">
          Seasonal Promotions & Financing Schemes
        </h2>
        <p className="text-xs text-charcoal-600 leading-relaxed">
          Dynamic promotional schemes and zero-percent finance tie-ups are scheduled for implementation with the administrative backend.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/contact"
            className="btn-base px-4 py-2 bg-crimson-700 text-white text-xs font-medium"
          >
            Visit Showroom for In-Store Schemes
          </Link>
          <a
            href={DEALERSHIP_INFO.contact.phoneHref}
            className="btn-base px-4 py-2 bg-charcoal-900 text-ivory-50 text-xs font-medium inline-flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5 text-crimson-500" />
            Call {DEALERSHIP_INFO.contact.phone}
          </a>
        </div>
      </div>
    </div>
  );
};
