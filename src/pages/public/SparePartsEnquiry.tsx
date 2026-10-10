import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, PhoneCall } from 'lucide-react';
import { DEALERSHIP_INFO } from '../../constants/business';

export const SparePartsEnquiry: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-borderBase pb-6 mb-8">
        <div className="text-xs text-charcoal-500 mb-2">
          <Link to="/" className="hover:text-charcoal-900">Home</Link> / <span>Spare Parts</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-charcoal-950">Genuine Spare Parts Enquiry</h1>
        <p className="text-sm text-charcoal-600 mt-2 max-w-2xl">
          Authorized OEM spare parts, engine components, body panels, and genuine fluids in Kurawali, Mainpuri.
        </p>
      </div>

      <div className="bg-white border border-borderBase p-8 rounded-sm text-center max-w-xl mx-auto space-y-4">
        <div className="w-12 h-12 bg-ivory-100 border border-borderBase text-charcoal-900 flex items-center justify-center mx-auto rounded-sm">
          <Wrench className="w-6 h-6" />
        </div>
        <h2 className="font-heading text-xl font-bold text-charcoal-900">
          Parts Inventory Search & Request Desk
        </h2>
        <p className="text-xs text-charcoal-600 leading-relaxed">
          The OEM parts catalogue search and part number enquiry form will be connected alongside backend inventory synchronization.
        </p>
        <div className="pt-2">
          <a
            href={DEALERSHIP_INFO.contact.phoneHref}
            className="btn-base px-4 py-2 bg-charcoal-900 text-ivory-50 text-xs font-medium"
          >
            <PhoneCall className="w-4 h-4 mr-1.5 text-crimson-500" />
            Check Part Availability via Phone: {DEALERSHIP_INFO.contact.phone}
          </a>
        </div>
      </div>
    </div>
  );
};
