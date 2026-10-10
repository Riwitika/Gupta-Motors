import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, MessageSquare, AlertCircle, HelpCircle } from 'lucide-react';
import { DEALERSHIP_INFO } from '../../constants/business';
import { useLanguage } from '../../context/LanguageContext';

export const Offers: React.FC = () => {
  const { language, t } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-borderBase pb-6">
        <div className="text-xs text-charcoal-500 mb-2">
          <Link to="/" className="hover:text-charcoal-900">{t.nav.home}</Link> / <span>{t.nav.offers}</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal-950">
          {t.offers.title}
        </h1>
        <p className="text-sm text-charcoal-600 mt-2 max-w-2xl leading-relaxed">
          {t.offers.subtitle}
        </p>
      </div>

      {/* Transparent Dealership Policy Banner */}
      <div className="bg-white border-l-4 border-crimson-700 border-y border-r border-borderBase p-6 rounded-sm shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-crimson-700 flex-shrink-0" />
          <h2 className="font-heading text-lg font-bold text-charcoal-950">
            {t.offers.noticeTitle}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed max-w-3xl">
          {t.offers.noticeBody}
        </p>
      </div>

      {/* Verified Scheme Inquiry Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Festive & Manufacturer Campaigns */}
        <div className="p-6 bg-white border border-borderBase rounded-sm space-y-3">
          <div className="w-10 h-10 bg-ivory-100 border border-borderBase text-crimson-700 flex items-center justify-center rounded-sm font-heading font-bold text-sm">
            01
          </div>
          <h3 className="font-heading text-base font-bold text-charcoal-950">
            {isHindi ? 'राष्ट्रीय व मौसमी अभियान' : 'National Manufacturer Campaigns'}
          </h3>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            {isHindi
              ? 'बजाज ऑटो द्वारा समय-समय पर घोषित किए जाने वाले आधिकारिक फ़ेस्टिवल ऑफ़र व कैशबैक योजनाओं की जानकारी हमारे शोरूम पर उपलब्ध रहती है।'
              : 'Bajaj Auto periodically announces seasonal promotional schemes. Real-time eligibility is evaluated at our Kurawali dealership on the date of billing.'}
          </p>
        </div>

        {/* Exchange Valuations */}
        <div className="p-6 bg-white border border-borderBase rounded-sm space-y-3">
          <div className="w-10 h-10 bg-ivory-100 border border-borderBase text-crimson-700 flex items-center justify-center rounded-sm font-heading font-bold text-sm">
            02
          </div>
          <h3 className="font-heading text-base font-bold text-charcoal-950">
            {isHindi ? 'पुरानी बाइक एक्सचेंज मूल्यांकन' : 'Two-Wheeler Exchange Evaluations'}
          </h3>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            {isHindi
              ? 'अपनी किसी भी पुरानी मोटरसाइकिल को शोरूम पर लाएं। हमारे विशेषज्ञ निष्पक्ष मूल्यांकन कर नई बजाज बाइक पर सर्वोत्तम एक्सचेंज मूल्य प्रदान करेंगे।'
              : 'Bring your existing two-wheeler to Gupta Motors. We perform physical condition assessments to offer transparent exchange values towards your new bike.'}
          </p>
        </div>

        {/* Low Down-Payment Financing */}
        <div className="p-6 bg-white border border-borderBase rounded-sm space-y-3">
          <div className="w-10 h-10 bg-ivory-100 border border-borderBase text-crimson-700 flex items-center justify-center rounded-sm font-heading font-bold text-sm">
            03
          </div>
          <h3 className="font-heading text-base font-bold text-charcoal-950">
            {isHindi ? 'कम डाउन-पेमेंट व आसान ईएमआई' : 'Low Down-Payment & Rural Finance'}
          </h3>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            {isHindi
              ? 'प्रमुख बैंकों एवं फ़ाइनेंस कंपनियों के साथ त्वरित ऋण अनुमोदन। न्यूनतम दस्तावेज़ीकरण और सुविधाजनक मासिक किस्तों की सुविधा।'
              : 'Tie-ups with leading financial institutions and rural banks for low down-payment schemes and quick KYC verification for agricultural and salaried buyers.'}
          </p>
        </div>
      </div>

      {/* Direct Contact for Current Schemes Card */}
      <div className="p-8 bg-ivory-100 border border-borderBase rounded-sm space-y-4 max-w-2xl mx-auto text-center">
        <div className="w-12 h-12 bg-white border border-borderBase text-crimson-700 flex items-center justify-center mx-auto rounded-sm">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h3 className="font-heading text-xl font-bold text-charcoal-950">
          {t.offers.actionTitle}
        </h3>
        <p className="text-xs text-charcoal-700 leading-relaxed max-w-lg mx-auto">
          {t.offers.actionBody}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <a
            href={DEALERSHIP_INFO.contact.phoneHref}
            className="btn-base px-5 py-2.5 bg-crimson-700 hover:bg-crimson-800 text-white text-xs font-semibold shadow-sm"
          >
            <PhoneCall className="w-4 h-4 mr-2" />
            {t.offers.callCta}
          </a>

          <a
            href={`${DEALERSHIP_INFO.contact.whatsAppHref}?text=${encodeURIComponent('Hello Vishal Ji, what are the current offers and financing schemes available at Gupta Motors Kurawali?')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-base px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {t.offers.whatsAppCta}
          </a>
        </div>
      </div>
    </div>
  );
};
