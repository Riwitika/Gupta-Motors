import React from 'react';
import { Link } from 'react-router-dom';
import { DEALERSHIP_INFO } from '../../constants/business';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-borderBase pb-6 mb-8">
        <div className="text-xs text-charcoal-500 mb-2">
          <Link to="/" className="hover:text-charcoal-900">Home</Link> / <span>About</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-charcoal-950">About Gupta Motors</h1>
        <p className="text-sm text-charcoal-600 mt-2 max-w-2xl">
          Proudly serving the automotive and two-wheeler commuting needs of Mainpuri district for over a decade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-white border border-borderBase p-6 rounded-sm space-y-4">
          <h2 className="font-heading text-lg font-bold text-charcoal-900">
            Our Dealership Heritage
          </h2>
          <p className="text-xs text-charcoal-700 leading-relaxed">
            Founded under the stewardship of <strong>{DEALERSHIP_INFO.owner}</strong>, Gupta Motors has grown from a local two-wheeler service workshop into an established, multi-bay dealership and authorized service point in Kurawali, Mainpuri.
          </p>
          <p className="text-xs text-charcoal-700 leading-relaxed">
            We adhere to strict quality standards: upfront transparent pricing, factory-calibrated service tools, genuine manufacturer replacement parts, and dedicated customer post-sales support.
          </p>
        </div>

        <div className="bg-ivory-100 border border-borderBase p-6 rounded-sm space-y-3">
          <h2 className="font-heading text-lg font-bold text-charcoal-900">
            Dealership Credentials
          </h2>
          <dl className="text-xs space-y-2">
            <div className="flex justify-between py-1 border-b border-borderBase">
              <dt className="text-charcoal-500">Business Name:</dt>
              <dd className="font-medium text-charcoal-900">{DEALERSHIP_INFO.name}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-borderBase">
              <dt className="text-charcoal-500">Proprietor:</dt>
              <dd className="font-medium text-charcoal-900">{DEALERSHIP_INFO.owner}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-borderBase">
              <dt className="text-charcoal-500">Location:</dt>
              <dd className="font-medium text-charcoal-900">{DEALERSHIP_INFO.address.full}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-borderBase">
              <dt className="text-charcoal-500">Helpline:</dt>
              <dd className="font-medium text-charcoal-900">{DEALERSHIP_INFO.contact.displayPhone}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};
