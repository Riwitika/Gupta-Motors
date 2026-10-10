import React from 'react';
import { MotorcycleSpec } from '../../data/bajajCatalogue';
import { useLanguage } from '../../context/LanguageContext';
import { DEALERSHIP_INFO } from '../../constants/business';
import { MessageSquare, PhoneCall } from 'lucide-react';

interface MotorcycleCardProps {
  motorcycle: MotorcycleSpec;
}

export const MotorcycleCard: React.FC<MotorcycleCardProps> = ({ motorcycle }) => {
  const { language, t } = useLanguage();
  const isHindi = language === 'hi';

  const whatsAppText = encodeURIComponent(
    `Hello Vishal Ji, I am inquiring about the ${motorcycle.name} at Gupta Motors, Kurawali. Please share the availability and on-road price details.`
  );
  const whatsAppUrl = `${DEALERSHIP_INFO.contact.whatsAppHref}?text=${whatsAppText}`;

  return (
    <article className="bg-white border border-borderBase hover:border-charcoal-400 transition-all duration-200 rounded-sm flex flex-col justify-between overflow-hidden group shadow-sm">
      {/* Top Banner & Graphic Header */}
      <div>
        {/* Card Header Strip */}
        <div className="p-4 bg-ivory-100 border-b border-borderBase flex justify-between items-start gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-charcoal-900 text-ivory-50 rounded-sm">
                {motorcycle.series}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-charcoal-600">
                {motorcycle.engineCc}
              </span>
            </div>
            <h3 className="font-heading text-lg font-bold text-charcoal-950 group-hover:text-crimson-700 transition-colors">
              {isHindi ? motorcycle.hindiName : motorcycle.name}
            </h3>
          </div>
          <span className="text-xs font-bold text-crimson-700 bg-crimson-50 border border-crimson-100 px-2 py-0.5 rounded-sm">
            Bajaj
          </span>
        </div>

        {/* Technical Blueprint Graphic Placeholder */}
        <div className="h-44 bg-gradient-to-b from-ivory-50 to-ivory-100 border-b border-borderBase relative p-4 flex flex-col justify-between overflow-hidden">
          {/* Subtle engineering grid background */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#18181B 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          <div className="relative z-10 flex justify-between items-center text-[11px] text-charcoal-500 font-mono">
            <span>ENGINE: {motorcycle.engineCc}</span>
            <span>{motorcycle.transmission}</span>
          </div>

          {/* Stylized Motorcycle Vector Graphic */}
          <div className="relative z-10 flex items-center justify-center py-2">
            <svg
              className="w-48 h-24 text-charcoal-800 transition-transform duration-300 group-hover:scale-105"
              viewBox="0 0 200 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Rear Wheel */}
              <circle cx="40" cy="70" r="22" stroke="currentColor" strokeWidth="3" />
              <circle cx="40" cy="70" r="10" stroke="#991B1B" strokeWidth="2" />
              <line x1="40" y1="48" x2="40" y2="92" stroke="currentColor" strokeWidth="1" opacity="0.6" />
              <line x1="18" y1="70" x2="62" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.6" />

              {/* Front Wheel */}
              <circle cx="160" cy="70" r="22" stroke="currentColor" strokeWidth="3" />
              <circle cx="160" cy="70" r="10" stroke="#991B1B" strokeWidth="2" />
              <line x1="160" y1="48" x2="160" y2="92" stroke="currentColor" strokeWidth="1" opacity="0.6" />
              <line x1="138" y1="70" x2="182" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.6" />

              {/* Frame & Engine Block */}
              <path d="M40 70 L90 70 L115 50 L85 45 Z" fill="#18181B" opacity="0.2" />
              <polyline points="40,70 85,70 120,40 145,25 155,50 160,70" strokeWidth="3" />
              
              {/* Fuel Tank & Seat Profile */}
              <path d="M75 42 C85 36, 110 32, 130 38 L122 48 L75 48 Z" fill="#991B1B" stroke="#991B1B" strokeWidth="2" />
              <path d="M55 46 Q75 44 85 46" stroke="currentColor" strokeWidth="4" />
              
              {/* Handlebar & Headlamp */}
              <line x1="145" y1="25" x2="135" y2="18" stroke="currentColor" strokeWidth="3" />
              <circle cx="152" cy="28" r="4" fill="#991B1B" />

              {/* Exhaust Pipe */}
              <path d="M95 68 L115 72 L70 78 L30 75" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          </div>

          <div className="relative z-10 flex justify-between items-center text-[10px] text-charcoal-600 font-medium">
            <span className="uppercase tracking-wider text-crimson-800 font-semibold">
              {motorcycle.fuelType}
            </span>
            <span className="font-mono">{motorcycle.brakes.split('/')[0]}</span>
          </div>
        </div>

        {/* Spec Snapshot & Description */}
        <div className="p-4 space-y-3">
          <p className="text-xs text-charcoal-600 leading-snug min-h-[32px]">
            {isHindi ? motorcycle.hindiTagline : motorcycle.tagline}
          </p>

          <div className="grid grid-cols-3 gap-2 py-2 border-y border-borderBase bg-ivory-50 px-2 rounded-sm text-center">
            {motorcycle.highlightSpecs.map((spec, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-[10px] uppercase text-charcoal-500 font-semibold">
                  {isHindi ? spec.hindiLabel : spec.label}
                </span>
                <span className="text-xs font-bold text-charcoal-900 mt-0.5">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-charcoal-500 italic">
            {t.catalogue.priceNote}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-base py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium flex items-center justify-center gap-1.5"
          title={`Inquire ${motorcycle.name} on WhatsApp`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{isHindi ? 'व्हाट्सएप' : 'WhatsApp'}</span>
        </a>

        <a
          href={DEALERSHIP_INFO.contact.phoneHref}
          className="btn-base py-2 px-3 bg-charcoal-900 hover:bg-black text-ivory-50 text-xs font-medium flex items-center justify-center gap-1.5 border border-charcoal-800"
        >
          <PhoneCall className="w-3.5 h-3.5 text-crimson-500" />
          <span>{isHindi ? 'कॉल करें' : 'Call'}</span>
        </a>
      </div>
    </article>
  );
};
