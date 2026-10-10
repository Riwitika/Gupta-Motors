import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock } from 'lucide-react';
import { DEALERSHIP_INFO } from '../../constants/business';

export const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-borderBase pb-6 mb-8">
        <div className="text-xs text-charcoal-500 mb-2">
          <Link to="/" className="hover:text-charcoal-900">Home</Link> / <span>Contact</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-charcoal-950">Contact & Dealership Visit</h1>
        <p className="text-sm text-charcoal-600 mt-2 max-w-2xl">
          Visit our showroom and service centre on G.T. Road, Kurawali, or contact our sales team directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information Card */}
        <div className="bg-white border border-borderBase p-6 rounded-sm space-y-6">
          <h2 className="font-heading text-lg font-bold text-charcoal-900 border-b border-borderBase pb-3">
            Dealership Contact Details
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-ivory-100 border border-borderBase text-crimson-700 rounded-sm">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-charcoal-900">Showroom & Workshop Address</p>
                <p className="text-charcoal-600 mt-0.5">{DEALERSHIP_INFO.address.full}</p>
                <p className="text-charcoal-500 mt-0.5">District Mainpuri, Uttar Pradesh — 205265</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-ivory-100 border border-borderBase text-crimson-700 rounded-sm">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-charcoal-900">Direct Phone Helpline</p>
                <a
                  href={DEALERSHIP_INFO.contact.phoneHref}
                  className="text-crimson-700 font-semibold hover:underline mt-0.5 block"
                >
                  {DEALERSHIP_INFO.contact.displayPhone}
                </a>
                <p className="text-charcoal-500 mt-0.5">Proprietor: {DEALERSHIP_INFO.owner}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-ivory-100 border border-borderBase text-crimson-700 rounded-sm">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-charcoal-900">Working Hours</p>
                <p className="text-charcoal-600 mt-0.5">{DEALERSHIP_INFO.operatingHours.days}</p>
                <p className="text-charcoal-500 mt-0.5">{DEALERSHIP_INFO.operatingHours.timing}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visit Advisory Card */}
        <div className="bg-ivory-100 border border-borderBase p-6 rounded-sm space-y-4">
          <h2 className="font-heading text-lg font-bold text-charcoal-900 border-b border-borderBase pb-3">
            Showroom Location & Transit
          </h2>
          <p className="text-xs text-charcoal-700 leading-relaxed">
            Gupta Motors is conveniently situated on the primary <strong>Grand Trunk (G.T.) Road corridor in Kurawali</strong>, making it readily accessible for vehicle buyers and workshop visits across Mainpuri, Bewar, and surrounding regions.
          </p>
          <div className="p-4 bg-white border border-borderBase rounded-sm text-xs text-charcoal-600 space-y-1">
            <p className="font-semibold text-charcoal-900">Test Rides & Documentation:</p>
            <p>Please carry a valid driving licence for vehicle test rides and original KYC documents for instantaneous vehicle loan financing approvals.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
