import React, { useState } from 'react';
import { MotorcycleSpec } from '../../data/bajajCatalogue';
import { useLanguage } from '../../context/LanguageContext';
import { DEALERSHIP_INFO } from '../../constants/business';
import { MessageSquare, PhoneCall, Gauge } from 'lucide-react';

interface MotorcycleCardProps {
  motorcycle: MotorcycleSpec;
}

export const MotorcycleCard: React.FC<MotorcycleCardProps> = ({ motorcycle }) => {
  const { language, t } = useLanguage();
  const isHindi = language === 'hi';
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const whatsAppText = encodeURIComponent(
    `Hello Vishal Ji, I am inquiring about the ${motorcycle.name} at Gupta Motors, Kurawali. Please share the availability and on-road price details.`
  );
  const whatsAppUrl = `${DEALERSHIP_INFO.contact.whatsAppHref}?text=${whatsAppText}`;

  return (
    <article className="bg-white border border-borderBase hover:border-charcoal-400 transition-all duration-200 rounded-sm flex flex-col justify-between overflow-hidden group shadow-sm">
      <div>
        {/* Card Header Strip */}
        <div className="p-3.5 bg-ivory-100 border-b border-borderBase flex justify-between items-start gap-2">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
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
          <span className="text-[10px] font-bold text-crimson-800 bg-crimson-50 border border-crimson-100 px-2 py-0.5 rounded-sm">
            Bajaj
          </span>
        </div>

        {/* Product Photography or Honest Branded Specification Card */}
        <div className="aspect-[16/10] bg-stone-100 relative overflow-hidden flex items-center justify-center border-b border-borderBase">
          {motorcycle.imagePath && !imageError ? (
            <>
              {/* Subtle loading skeleton */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center text-stone-400">
                  <Gauge className="w-6 h-6 animate-spin opacity-40" />
                </div>
              )}
              <img
                src={motorcycle.imagePath}
                alt={isHindi ? motorcycle.imageAltHindi : motorcycle.imageAlt}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                className={`w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
              {/* Engine Specification Floating Badge */}
              <div className="absolute bottom-2 right-2 bg-charcoal-950/85 backdrop-blur-xs text-ivory-50 text-[10px] font-mono font-medium px-2 py-0.5 rounded-sm shadow-xs">
                {motorcycle.engineCc}
              </div>
            </>
          ) : (
            /* Honest, Premium Branded Technical Card */
            <div className="w-full h-full p-4 flex flex-col justify-between bg-charcoal-950 text-ivory-100 relative overflow-hidden">
              {/* Subtle architectural grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#FDFBF7 1px, transparent 1px)',
                  backgroundSize: '12px 12px',
                }}
              />

              {/* Top technical strip */}
              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-charcoal-400">
                <span className="uppercase tracking-wider">{motorcycle.fuelType}</span>
                <span className="text-crimson-400 font-semibold">{motorcycle.transmission}</span>
              </div>

              {/* Center Model Typography & Monogram */}
              <div className="relative z-10 text-center my-auto py-1">
                <div className="inline-block px-2 py-0.5 bg-crimson-950/80 border border-crimson-800/60 rounded-xs text-[9px] uppercase tracking-widest text-crimson-300 font-bold mb-1">
                  {isHindi ? 'आधिकारिक मॉडल विवरण' : 'Official Specification'}
                </div>
                <div className="font-heading font-bold text-lg text-ivory-50 tracking-wide">
                  {isHindi ? motorcycle.hindiName : motorcycle.name}
                </div>
                <div className="text-[10px] text-charcoal-300 font-medium mt-0.5">
                  {isHindi ? 'शोरूम पर प्रत्यक्ष निरीक्षण उपलब्ध' : 'Verified Showroom Lineup • Kurawali'}
                </div>
              </div>

              {/* Bottom Honest Notice Strip */}
              <div className="relative z-10 flex items-center justify-between border-t border-charcoal-800 pt-1.5 text-[9px] text-charcoal-400">
                <span className="font-medium text-crimson-400">
                  {isHindi ? 'फोटो प्रतीक्षित • शोरूम परामर्श' : 'Official Photo Awaited'}
                </span>
                <span className="font-mono">{motorcycle.engineCc}</span>
              </div>
            </div>
          )}
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
