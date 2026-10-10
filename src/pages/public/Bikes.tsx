import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { BAJAJ_MOTORCYCLES, MotorcycleCategory } from '../../data/bajajCatalogue';
import { MotorcycleCard } from '../../components/common/MotorcycleCard';
import { useLanguage } from '../../context/LanguageContext';
import { PhoneCall, MessageSquare } from 'lucide-react';
import { DEALERSHIP_INFO } from '../../constants/business';

export const Bikes: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, t } = useLanguage();
  const isHindi = language === 'hi';

  const categoryParam = searchParams.get('category') as MotorcycleCategory | null;
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam || 'all');

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const filteredBikes = BAJAJ_MOTORCYCLES.filter((bike) => {
    if (activeCategory === 'all') return true;
    return bike.category === activeCategory;
  });

  const categories = [
    { id: 'all', label: t.catalogue.filterAll },
    { id: 'pulsar', label: t.catalogue.filterPulsar },
    { id: 'commuter', label: t.catalogue.filterCommuter },
    { id: 'cruiser', label: t.catalogue.filterCruiser },
    { id: 'tourer', label: t.catalogue.filterTourer },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Breadcrumb */}
      <div className="border-b border-borderBase pb-6">
        <div className="text-xs text-charcoal-500 mb-2">
          <Link to="/" className="hover:text-charcoal-900">{t.nav.home}</Link> / <span>{t.nav.bikes}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal-950">
              {t.catalogue.title}
            </h1>
            <p className="text-sm text-charcoal-600 mt-1 max-w-2xl leading-relaxed">
              {t.catalogue.subtitle}
            </p>
          </div>

          <div className="flex gap-2">
            <a
              href={DEALERSHIP_INFO.contact.phoneHref}
              className="btn-base px-3.5 py-2 bg-charcoal-900 text-ivory-50 text-xs font-medium"
            >
              <PhoneCall className="w-3.5 h-3.5 mr-1.5 text-crimson-500" />
              <span>{DEALERSHIP_INFO.contact.phone}</span>
            </a>
            <a
              href={DEALERSHIP_INFO.contact.whatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base px-3.5 py-2 bg-emerald-700 text-white text-xs font-medium"
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 pt-1 border-b border-borderBase pb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-4 py-2 text-xs font-medium rounded-sm transition-colors ${
              activeCategory === cat.id
                ? 'bg-crimson-700 text-white shadow-sm font-semibold'
                : 'bg-white hover:bg-ivory-200 text-charcoal-700 border border-borderBase'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Catalogue Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs text-charcoal-500">
          <span>
            {isHindi
              ? `${filteredBikes.length} मॉडल प्रदर्शित`
              : `Showing ${filteredBikes.length} official models`}
          </span>
          <span className="italic">{t.catalogue.priceNote}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBikes.map((bike) => (
            <MotorcycleCard key={bike.id} motorcycle={bike} />
          ))}
        </div>
      </div>

      {/* Truthful Pricing Advisory Note */}
      <div className="p-4 bg-ivory-100 border border-borderBase rounded-sm text-xs text-charcoal-700 leading-relaxed space-y-1">
        <p className="font-semibold text-charcoal-900">
          {isHindi ? 'मूल्य निर्धारण एवं आरटीओ पंजीकरण सूचना:' : 'Price Quotation & Registration Notice:'}
        </p>
        <p>
          {isHindi
            ? 'ऑन-रोड कीमतों में आरटीओ टैक्स, वाहन बीमा और अनिवार्य पंजीकरण शुल्क शामिल होते हैं। सटीक उद्धरण और मॉडल उपलब्धता के लिए कृपया कुरावली शोरूम पर पधारें या विशाल गुप्ता से संपर्क करें।'
            : 'On-road prices include Uttar Pradesh state RTO registration, mandatory insurance, and road taxes. For exact Kurawali on-road quotes, color availability, or delivery timelines, contact Gupta Motors directly.'}
        </p>
      </div>
    </div>
  );
};
