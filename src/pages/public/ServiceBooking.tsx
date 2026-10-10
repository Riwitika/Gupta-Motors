import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, PhoneCall } from 'lucide-react';
import { DEALERSHIP_INFO } from '../../constants/business';

export const ServiceBooking: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-borderBase pb-6 mb-8">
        <div className="text-xs text-charcoal-500 mb-2">
          <Link to="/" className="hover:text-charcoal-900">Home</Link> / <span>Service Booking</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-charcoal-950">Book Workshop Service</h1>
        <p className="text-sm text-charcoal-600 mt-2 max-w-2xl">
          Reserve your scheduled periodic maintenance or emergency repair slot at our authorized service centre.
        </p>
      </div>

      <div className="bg-white border border-borderBase p-8 rounded-sm text-center max-w-xl mx-auto space-y-4">
        <div className="w-12 h-12 bg-ivory-100 border border-borderBase text-crimson-700 flex items-center justify-center mx-auto rounded-sm">
          <Calendar className="w-6 h-6" />
        </div>
        <h2 className="font-heading text-xl font-bold text-charcoal-900">
          Service Appointment Booking System
        </h2>
        <p className="text-xs text-charcoal-600 leading-relaxed">
          The interactive service scheduling workflow and digital job card intake form will be connected in subsequent project stages.
        </p>
        <div className="p-4 bg-ivory-50 border border-borderBase rounded-sm text-xs text-charcoal-700">
          <p className="font-semibold text-charcoal-900 mb-1">Immediate Assistance & Walk-in Bookings:</p>
          <p>Please call the service desk directly to schedule priority morning intake slots.</p>
        </div>
        <div className="pt-2">
          <a
            href={DEALERSHIP_INFO.contact.phoneHref}
            className="btn-base px-5 py-2.5 bg-crimson-700 hover:bg-crimson-800 text-white text-xs font-medium"
          >
            <PhoneCall className="w-4 h-4 mr-1.5" />
            Call Workshop Service: {DEALERSHIP_INFO.contact.phone}
          </a>
        </div>
      </div>
    </div>
  );
};
