import React from 'react';
import { Link } from 'react-router-dom';
import { DEALERSHIP_INFO } from '../../constants/business';

export const Bikes: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb & Header */}
      <div className="border-b border-borderBase pb-6 mb-8">
        <div className="text-xs text-charcoal-500 mb-2">
          <Link to="/" className="hover:text-charcoal-900">Home</Link> / <span>Motorcycles</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-charcoal-950">Motorcycle Showroom</h1>
        <p className="text-sm text-charcoal-600 mt-2 max-w-2xl">
          Browse our authorized catalogue of motorcycles available at our Kurawali dealership with on-road pricing and finance options.
        </p>
      </div>

      {/* Placeholder Content Area */}
      <div className="bg-white border border-borderBase p-8 rounded-sm text-center max-w-xl mx-auto space-y-4">
        <div className="w-12 h-12 bg-ivory-100 border border-borderBase text-crimson-700 flex items-center justify-center mx-auto rounded-sm font-heading font-bold text-lg">
          GM
        </div>
        <h2 className="font-heading text-xl font-bold text-charcoal-900">
          Motorcycle Catalogue Module
        </h2>
        <p className="text-xs text-charcoal-600 leading-relaxed">
          Vehicle catalogue, technical specifications, color variants, and EMI estimates will be connected in subsequent project phases.
        </p>
        <div className="pt-2">
          <a
            href={DEALERSHIP_INFO.contact.phoneHref}
            className="btn-base px-4 py-2 bg-charcoal-900 text-ivory-50 text-xs font-medium"
          >
            Inquire Stock via Phone: {DEALERSHIP_INFO.contact.phone}
          </a>
        </div>
      </div>
    </div>
  );
};
