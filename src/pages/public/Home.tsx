import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wrench, ShieldCheck, PhoneCall, MessageSquare, Navigation } from 'lucide-react';
import { DEALERSHIP_INFO } from '../../constants/business';
import { useLanguage } from '../../context/LanguageContext';
import { BAJAJ_MOTORCYCLES } from '../../data/bajajCatalogue';
import { MotorcycleCard } from '../../components/common/MotorcycleCard';

export const Home: React.FC = () => {
  const { language, t } = useLanguage();
  const isHindi = language === 'hi';

  const featuredBikes = BAJAJ_MOTORCYCLES.filter((b) => b.featured).slice(0, 4);

  return (
    <div className="space-y-12 pb-12">
      {/* 1. Hero Section — Editorial Motorcycle Led */}
      <section className="border-b border-borderBase bg-ivory-100 py-10 md:py-14 relative overflow-hidden">
        {/* Subtle geometric motorcycle line background */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(135deg, #18181B 25%, transparent 25%), linear-gradient(225deg, #18181B 25%, transparent 25%)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-ivory-200 border border-borderBase rounded-sm text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                <span className="w-1.5 h-1.5 bg-crimson-700 rounded-full animate-pulse"></span>
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-charcoal-950 leading-[1.15]">
                {t.hero.title}
              </h1>

              <p className="text-base sm:text-lg text-charcoal-700 leading-relaxed max-w-2xl">
                {t.hero.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-3">
                <Link
                  to="/bikes"
                  className="btn-base px-5 py-2.5 bg-crimson-700 hover:bg-crimson-800 text-white font-medium shadow-sm"
                >
                  {t.hero.exploreBikes}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>

                <Link
                  to="/service-booking"
                  className="btn-base px-5 py-2.5 bg-white hover:bg-ivory-50 text-charcoal-900 border border-borderBase font-medium shadow-sm"
                >
                  <Wrench className="w-4 h-4 mr-1.5 text-crimson-700" />
                  {t.hero.bookService}
                </Link>

                <a
                  href={DEALERSHIP_INFO.contact.whatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  {t.hero.whatsAppEnquiry}
                </a>
              </div>

              {/* Address Quick Mention */}
              <div className="pt-2 flex items-center gap-2 text-xs text-charcoal-600 font-medium">
                <Navigation className="w-3.5 h-3.5 text-crimson-700" />
                <span>{DEALERSHIP_INFO.address.line1}, {DEALERSHIP_INFO.address.city} (U.P.)</span>
              </div>
            </div>

            {/* Right Hero Graphic: Flagship Spec Card */}
            <div className="lg:col-span-5">
              <div className="bg-white border-2 border-charcoal-900 p-6 rounded-sm shadow-md space-y-4 relative">
                <div className="flex justify-between items-center border-b border-borderBase pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-crimson-800 bg-crimson-50 px-2 py-0.5 rounded-sm">
                      {isHindi ? 'लोकप्रिय मॉडल' : 'Featured Flagship'}
                    </span>
                    <h2 className="font-heading text-xl font-bold text-charcoal-950 mt-1">
                      Pulsar NS200
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-bold text-charcoal-600">
                    199.5 cc
                  </span>
                </div>

                <p className="text-xs text-charcoal-600 leading-relaxed">
                  {isHindi
                    ? 'ट्रिपल स्पार्क लिक्विड कूल्ड इंजन, यूएसडी फोर्क्स और डुअल-चैनल एबीएस के साथ उत्कृष्ट प्रदर्शन।'
                    : 'Triple-spark liquid-cooled 4-valve engine with USD front forks and race-tuned dual-channel ABS.'}
                </p>

                <div className="grid grid-cols-3 gap-2 bg-ivory-50 p-2.5 border border-borderBase rounded-sm text-center">
                  <div>
                    <span className="text-[10px] uppercase text-charcoal-500 font-semibold">Power</span>
                    <div className="text-xs font-bold text-charcoal-950 mt-0.5">24.5 PS</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-charcoal-500 font-semibold">Torque</span>
                    <div className="text-xs font-bold text-charcoal-950 mt-0.5">18.74 Nm</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-charcoal-500 font-semibold">Gears</span>
                    <div className="text-xs font-bold text-charcoal-950 mt-0.5">6-Speed</div>
                  </div>
                </div>

                <div className="pt-1 flex gap-2">
                  <a
                    href={`${DEALERSHIP_INFO.contact.whatsAppHref}?text=${encodeURIComponent('Hello Vishal Ji, I would like to inquire about the Pulsar NS200 at Gupta Motors Kurawali.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-base w-full py-2 bg-emerald-700 text-white text-xs font-medium"
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1" />
                    {isHindi ? 'व्हाट्सएप पूछताछ' : 'Inquire on WhatsApp'}
                  </a>
                  <a
                    href={DEALERSHIP_INFO.contact.phoneHref}
                    className="btn-base px-3 py-2 bg-charcoal-900 text-ivory-50 text-xs font-medium"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Browse by Motorcycle Family */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-borderBase pb-3 mb-6 gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-crimson-700">
              {isHindi ? 'मोटरसाइकिल श्रेणियां' : 'Categories'}
            </span>
            <h2 className="font-heading text-2xl font-bold text-charcoal-950 mt-0.5">
              {isHindi ? 'अपनी पसंद की बाइक चुनें' : 'Explore by Motorcycle Series'}
            </h2>
          </div>
          <Link
            to="/bikes"
            className="text-xs font-bold text-crimson-700 hover:text-crimson-800 flex items-center gap-1"
          >
            {t.catalogue.viewAllModels} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/bikes?category=pulsar"
            className="p-4 bg-white border border-borderBase hover:border-charcoal-900 rounded-sm transition-all group"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-crimson-700 mb-1">
              Pulsar Series
            </div>
            <div className="font-heading text-lg font-bold text-charcoal-950 group-hover:text-crimson-700 transition-colors">
              Sports & Naked
            </div>
            <p className="text-xs text-charcoal-600 mt-1">
              {isHindi ? '125cc से 250cc तक रोमांचक पावर' : '125cc to 250cc definitive performance machines'}
            </p>
          </Link>

          <Link
            to="/bikes?category=commuter"
            className="p-4 bg-white border border-borderBase hover:border-charcoal-900 rounded-sm transition-all group"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-charcoal-600 mb-1">
              Platina • CT • Freedom
            </div>
            <div className="font-heading text-lg font-bold text-charcoal-950 group-hover:text-crimson-700 transition-colors">
              Mileage & Commuter
            </div>
            <p className="text-xs text-charcoal-600 mt-1">
              {isHindi ? 'सर्वोत्तम माइलेज व सीएनजी विकल्प' : 'Comfortec suspension and revolutionary dual-fuel CNG'}
            </p>
          </Link>

          <Link
            to="/bikes?category=cruiser"
            className="p-4 bg-white border border-borderBase hover:border-charcoal-900 rounded-sm transition-all group"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-charcoal-600 mb-1">
              Avenger Series
            </div>
            <div className="font-heading text-lg font-bold text-charcoal-950 group-hover:text-crimson-700 transition-colors">
              Cruiser & Touring
            </div>
            <p className="text-xs text-charcoal-600 mt-1">
              {isHindi ? 'आरामदायक राइड व लो सीट हाइट' : 'Highway wind protection and low-slung relaxed seating'}
            </p>
          </Link>

          <Link
            to="/bikes?category=tourer"
            className="p-4 bg-white border border-borderBase hover:border-charcoal-900 rounded-sm transition-all group"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-charcoal-600 mb-1">
              Dominar Series
            </div>
            <div className="font-heading text-lg font-bold text-charcoal-950 group-hover:text-crimson-700 transition-colors">
              Hyper Tourer
            </div>
            <p className="text-xs text-charcoal-600 mt-1">
              {isHindi ? '40 PS तक लिक्विड कूल्ड पावर' : '250cc & 400cc long distance highway tourers'}
            </p>
          </Link>
        </div>
      </section>

      {/* 3. Featured Motorcycles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-borderBase pb-3 mb-6 gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-crimson-700">
              {isHindi ? 'शोरूम मुख्य आकर्षण' : 'Showroom Highlights'}
            </span>
            <h2 className="font-heading text-2xl font-bold text-charcoal-950 mt-0.5">
              {t.catalogue.title}
            </h2>
          </div>
          <Link
            to="/bikes"
            className="btn-base px-3 py-1.5 bg-ivory-100 hover:bg-ivory-200 text-charcoal-900 border border-borderBase text-xs font-semibold"
          >
            {t.catalogue.viewAllModels}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBikes.map((bike) => (
            <MotorcycleCard key={bike.id} motorcycle={bike} />
          ))}
        </div>
      </section>

      {/* 4. Service Centre & Spare Parts Split Feature */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Workshop Service Card */}
          <div className="p-6 bg-white border border-borderBase rounded-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-ivory-100 border border-borderBase text-crimson-700 flex items-center justify-center rounded-sm">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-xl font-bold text-charcoal-950">
                {t.highlights.serviceTitle}
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                {t.highlights.serviceDesc}
              </p>
              <ul className="text-xs text-charcoal-700 space-y-1.5 pt-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-crimson-700 rounded-full"></span>
                  <span>{isHindi ? 'नियमित सर्विसिंग व इंजन ट्यून-अप' : 'Periodic maintenance & computerized engine diagnostics'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-crimson-700 rounded-full"></span>
                  <span>{isHindi ? 'बजाज प्रमाणित ल्यूब्रिकेंट्स एवं ऑयल' : 'Official Bajaj genuine lubricants & oil filter replacement'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-crimson-700 rounded-full"></span>
                  <span>{isHindi ? 'ब्रेक, क्लच व सस्पेंशन मरम्मत' : 'Brake overhaul, clutch repair & suspension inspection'}</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <Link
                to="/service-booking"
                className="btn-base w-full sm:w-auto px-5 py-2.5 bg-crimson-700 hover:bg-crimson-800 text-white font-medium text-xs shadow-sm"
              >
                {t.highlights.serviceAction}
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          </div>

          {/* Genuine Spares Card */}
          <div className="p-6 bg-white border border-borderBase rounded-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-ivory-100 border border-borderBase text-charcoal-900 flex items-center justify-center rounded-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-xl font-bold text-charcoal-950">
                {t.highlights.sparesTitle}
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                {t.highlights.sparesDesc}
              </p>
              <ul className="text-xs text-charcoal-700 space-y-1.5 pt-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-crimson-700 rounded-full"></span>
                  <span>{isHindi ? '100% फ़ैक्ट्री मूल स्पेयर पार्ट्स' : '100% genuine OEM factory packaged components'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-crimson-700 rounded-full"></span>
                  <span>{isHindi ? 'डिस्क पैड्स, स्पार्क प्लग व केबल्स' : 'Brake pads, clutch cables, chain kits & spark plugs'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-crimson-700 rounded-full"></span>
                  <span>{isHindi ? 'दुकान पर उपलब्धता की त्वरित पुष्टि' : 'Fast over-the-counter shelf stock confirmation'}</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <Link
                to="/spare-parts"
                className="btn-base w-full sm:w-auto px-5 py-2.5 bg-charcoal-900 hover:bg-black text-ivory-50 font-medium text-xs border border-charcoal-800 shadow-sm"
              >
                {t.highlights.sparesAction}
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Dealership Location & Direct Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 bg-ivory-100 border border-borderBase rounded-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-crimson-700">
                {isHindi ? 'डीलरशिप पता व संपर्क' : 'Dealership Location & Helpline'}
              </span>
              <h3 className="font-heading text-2xl font-bold text-charcoal-950">
                Gupta Motors — Kurawali
              </h3>
              <p className="text-sm text-charcoal-700 font-medium">
                {DEALERSHIP_INFO.address.full}
              </p>
              <p className="text-xs text-charcoal-600">
                {t.footer.owner} • {isHindi ? 'बजाज मोटरसाइकिल बिक्री, सर्विस व मूल स्पेयर पार्ट्स' : 'Bajaj motorcycle sales, service and spare parts retail'}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5">
              <a
                href={DEALERSHIP_INFO.maps.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-base py-2.5 px-4 bg-charcoal-900 hover:bg-black text-ivory-50 text-xs font-medium text-center"
              >
                <Navigation className="w-3.5 h-3.5 mr-1.5" />
                {t.contact.directionsBtn}
              </a>

              <a
                href={DEALERSHIP_INFO.contact.phoneHref}
                className="btn-base py-2.5 px-4 bg-white hover:bg-ivory-50 text-charcoal-950 border border-borderBase text-xs font-semibold text-center"
              >
                <PhoneCall className="w-3.5 h-3.5 mr-1.5 text-crimson-700" />
                {DEALERSHIP_INFO.contact.displayPhone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
