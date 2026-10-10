import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wrench, ShieldCheck, PhoneCall, Gauge } from 'lucide-react';
import { DEALERSHIP_INFO } from '../../constants/business';

export const Home: React.FC = () => {
  return (
    <div className="space-y-12 pb-12">
      {/* Editorial Hero Banner */}
      <section className="border-b border-borderBase bg-ivory-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-ivory-200 border border-borderBase rounded-sm text-xs font-semibold uppercase tracking-wider text-charcoal-700">
              <span className="w-1.5 h-1.5 bg-crimson-700 rounded-full"></span>
              Mainpuri District Authorized Centre
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-charcoal-950 leading-tight">
              Motorcycle Sales, Certified Spares & Factory-Grade Service.
            </h1>
            <p className="text-base sm:text-lg text-charcoal-700 leading-relaxed">
              Serving riders across Kurawali and Mainpuri since {DEALERSHIP_INFO.establishedYear}. Trusted guidance, honest pricing, genuine manufacturer parts, and expert certified mechanics.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/bikes"
                className="btn-base px-5 py-2.5 bg-crimson-700 hover:bg-crimson-800 text-white font-medium shadow-sm"
              >
                Browse Motorcycle Lineup
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
              <Link
                to="/service-booking"
                className="btn-base px-5 py-2.5 bg-ivory-50 hover:bg-white text-charcoal-900 border border-borderBase"
              >
                Book Service Appointment
              </Link>
              <a
                href={DEALERSHIP_INFO.contact.phoneHref}
                className="btn-base px-4 py-2.5 bg-charcoal-900 hover:bg-black text-ivory-50 border border-charcoal-800"
              >
                <PhoneCall className="w-4 h-4 mr-1.5 text-crimson-500" />
                Call {DEALERSHIP_INFO.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Grid / Quick Access Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-borderBase rounded-sm shadow-sm">
            <div className="w-10 h-10 bg-crimson-50 border border-crimson-100 flex items-center justify-center text-crimson-700 mb-4 rounded-sm">
              <Gauge className="w-5 h-5" />
            </div>
            <h2 className="font-heading text-lg font-bold text-charcoal-950 mb-2">
              New Motorcycles
            </h2>
            <p className="text-xs text-charcoal-600 leading-relaxed mb-4">
              Explore commuter champions, performance sports motorcycles, and premium touring bikes with tailored finance assistance.
            </p>
            <Link to="/bikes" className="text-xs font-semibold text-crimson-700 hover:text-crimson-800 flex items-center gap-1">
              Explore Available Models <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 bg-white border border-borderBase rounded-sm shadow-sm">
            <div className="w-10 h-10 bg-ivory-100 border border-borderBase flex items-center justify-center text-charcoal-800 mb-4 rounded-sm">
              <Wrench className="w-5 h-5" />
            </div>
            <h2 className="font-heading text-lg font-bold text-charcoal-950 mb-2">
              Workshop & Service
            </h2>
            <p className="text-xs text-charcoal-600 leading-relaxed mb-4">
              Computerized diagnostics, genuine lubricants, automated washing, and experienced master technicians.
            </p>
            <Link to="/service-booking" className="text-xs font-semibold text-crimson-700 hover:text-crimson-800 flex items-center gap-1">
              Schedule Service Slot <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 bg-white border border-borderBase rounded-sm shadow-sm">
            <div className="w-10 h-10 bg-ivory-100 border border-borderBase flex items-center justify-center text-charcoal-800 mb-4 rounded-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-heading text-lg font-bold text-charcoal-950 mb-2">
              100% Genuine Spare Parts
            </h2>
            <p className="text-xs text-charcoal-600 leading-relaxed mb-4">
              Direct factory spares, brake assemblies, chain sprockets, electricals, and original consumable accessories.
            </p>
            <Link to="/spare-parts" className="text-xs font-semibold text-crimson-700 hover:text-crimson-800 flex items-center gap-1">
              Check Part Availability <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Dealership Profile Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 bg-ivory-100 border border-borderBase rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-crimson-700">Official Facility</span>
            <h3 className="font-heading text-xl font-bold text-charcoal-900 mt-0.5">
              Gupta Motors — Kurawali Dealership
            </h3>
            <p className="text-xs text-charcoal-600 mt-1">
              {DEALERSHIP_INFO.address.full} • Proprietor: {DEALERSHIP_INFO.owner}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/contact"
              className="btn-base px-4 py-2 bg-charcoal-900 text-ivory-50 hover:bg-black text-xs font-medium"
            >
              Get Directions & Visit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
