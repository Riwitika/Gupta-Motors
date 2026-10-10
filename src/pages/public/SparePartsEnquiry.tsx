import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, CheckCircle2, AlertCircle, PhoneCall, MessageSquare, ShieldCheck } from 'lucide-react';
import { DEALERSHIP_INFO } from '../../constants/business';
import { useLanguage } from '../../context/LanguageContext';

interface PartsFormState {
  customerName: string;
  customerPhone: string;
  bikeModel: string;
  partDescription: string;
  partNumber: string;
  urgency: 'routine' | 'urgent';
}

interface PartsFormErrors {
  customerName?: string;
  customerPhone?: string;
  bikeModel?: string;
  partDescription?: string;
}

export const SparePartsEnquiry: React.FC = () => {
  const { language, t } = useLanguage();
  const isHindi = language === 'hi';

  const [form, setForm] = useState<PartsFormState>({
    customerName: '',
    customerPhone: '',
    bikeModel: '',
    partDescription: '',
    partNumber: '',
    urgency: 'routine',
  });

  const [errors, setErrors] = useState<PartsFormErrors>({});
  const [submittedData, setSubmittedData] = useState<PartsFormState | null>(null);

  const validate = (): boolean => {
    const errs: PartsFormErrors = {};

    if (!form.customerName.trim()) {
      errs.customerName = t.validation.nameRequired;
    }

    const cleanPhone = form.customerPhone.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      errs.customerPhone = t.validation.phoneInvalid;
    }

    if (!form.bikeModel.trim()) {
      errs.bikeModel = t.validation.modelRequired;
    }

    if (!form.partDescription.trim()) {
      errs.partDescription = t.validation.partRequired;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmittedData({ ...form });
    }
  };

  const handleReset = () => {
    setForm({
      customerName: '',
      customerPhone: '',
      bikeModel: '',
      partDescription: '',
      partNumber: '',
      urgency: 'routine',
    });
    setErrors({});
    setSubmittedData(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-borderBase pb-6">
        <div className="text-xs text-charcoal-500 mb-2">
          <Link to="/" className="hover:text-charcoal-900">{t.nav.home}</Link> / <span>{t.nav.spares}</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal-950">
          {t.spareParts.title}
        </h1>
        <p className="text-sm text-charcoal-600 mt-2 max-w-2xl leading-relaxed">
          {t.spareParts.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-8">
          {submittedData ? (
            /* Confirmation Feedback State */
            <div className="bg-white border-2 border-emerald-700 p-6 sm:p-8 rounded-sm shadow-sm space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-charcoal-950">
                    {t.spareParts.successTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal-600 mt-1 leading-relaxed">
                    {t.spareParts.successDesc}
                  </p>
                </div>
              </div>

              {/* Logged Summary Details */}
              <div className="bg-ivory-50 border border-borderBase p-4 rounded-sm space-y-2 text-xs">
                <div className="font-bold text-charcoal-900 border-b border-borderBase pb-2 uppercase tracking-wider text-[11px]">
                  {isHindi ? 'पूछताछ विवरण' : 'Enquiry Log'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <p><span className="text-charcoal-500">{isHindi ? 'ग्राहक:' : 'Customer:'}</span> <strong>{submittedData.customerName}</strong></p>
                  <p><span className="text-charcoal-500">{isHindi ? 'फ़ोन:' : 'Phone:'}</span> <strong>{submittedData.customerPhone}</strong></p>
                  <p><span className="text-charcoal-500">{isHindi ? 'मॉडल:' : 'Model:'}</span> <strong>{submittedData.bikeModel}</strong></p>
                  <p><span className="text-charcoal-500">{isHindi ? 'पार्ट नंबर:' : 'Part No:'}</span> <strong>{submittedData.partNumber || 'N/A'}</strong></p>
                </div>
                <div className="pt-2 border-t border-borderBase">
                  <span className="text-charcoal-500">{isHindi ? 'आवश्यक पार्ट विवरण:' : 'Required Part:'}</span>
                  <p className="mt-0.5 text-charcoal-800 font-medium">{submittedData.partDescription}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-base px-5 py-2.5 bg-charcoal-900 text-ivory-50 text-xs font-semibold"
                >
                  {t.spareParts.newRequestBtn}
                </button>
                <a
                  href={`${DEALERSHIP_INFO.contact.whatsAppHref}?text=${encodeURIComponent(`Hello Vishal Ji, I submitted an enquiry for ${submittedData.partDescription} for ${submittedData.bikeModel}. Please check stock at Kurawali store.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base px-5 py-2.5 bg-emerald-700 text-white text-xs font-semibold"
                >
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  {isHindi ? 'व्हाट्सएप पर जाँचें' : 'Check on WhatsApp'}
                </a>
              </div>
            </div>
          ) : (
            /* Active Parts Enquiry Form */
            <form onSubmit={handleSubmit} className="bg-white border border-borderBase p-6 sm:p-8 rounded-sm shadow-sm space-y-6">
              <div className="flex items-center gap-2 border-b border-borderBase pb-3">
                <Package className="w-5 h-5 text-crimson-700" />
                <h2 className="font-heading text-xl font-bold text-charcoal-950">
                  {t.spareParts.formTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Name */}
                <div>
                  <label htmlFor="customerName" className="block text-xs font-semibold text-charcoal-800 mb-1">
                    {t.spareParts.nameLabel}
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder={t.spareParts.namePlaceholder}
                    className={`w-full px-3 py-2 bg-ivory-50 border rounded-sm text-xs text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-1 focus:ring-crimson-700 ${
                      errors.customerName ? 'border-red-600 bg-red-50/30' : 'border-borderBase'
                    }`}
                    aria-invalid={Boolean(errors.customerName)}
                    aria-describedby={errors.customerName ? 'customerName-error' : undefined}
                  />
                  {errors.customerName && (
                    <p id="customerName-error" className="text-[11px] text-red-600 mt-1">
                      {errors.customerName}
                    </p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label htmlFor="customerPhone" className="block text-xs font-semibold text-charcoal-800 mb-1">
                    {t.spareParts.phoneLabel}
                  </label>
                  <input
                    id="customerPhone"
                    type="tel"
                    maxLength={10}
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    placeholder={t.spareParts.phonePlaceholder}
                    className={`w-full px-3 py-2 bg-ivory-50 border rounded-sm text-xs text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-1 focus:ring-crimson-700 ${
                      errors.customerPhone ? 'border-red-600 bg-red-50/30' : 'border-borderBase'
                    }`}
                    aria-invalid={Boolean(errors.customerPhone)}
                    aria-describedby={errors.customerPhone ? 'customerPhone-error' : undefined}
                  />
                  {errors.customerPhone && (
                    <p id="customerPhone-error" className="text-[11px] text-red-600 mt-1">
                      {errors.customerPhone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bike Model */}
                <div>
                  <label htmlFor="bikeModel" className="block text-xs font-semibold text-charcoal-800 mb-1">
                    {t.spareParts.modelLabel}
                  </label>
                  <input
                    id="bikeModel"
                    type="text"
                    value={form.bikeModel}
                    onChange={(e) => setForm({ ...form, bikeModel: e.target.value })}
                    placeholder={t.spareParts.modelPlaceholder}
                    className={`w-full px-3 py-2 bg-ivory-50 border rounded-sm text-xs text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-1 focus:ring-crimson-700 ${
                      errors.bikeModel ? 'border-red-600 bg-red-50/30' : 'border-borderBase'
                    }`}
                    aria-invalid={Boolean(errors.bikeModel)}
                    aria-describedby={errors.bikeModel ? 'bikeModel-error' : undefined}
                  />
                  {errors.bikeModel && (
                    <p id="bikeModel-error" className="text-[11px] text-red-600 mt-1">
                      {errors.bikeModel}
                    </p>
                  )}
                </div>

                {/* Part Number (Optional) */}
                <div>
                  <label htmlFor="partNumber" className="block text-xs font-semibold text-charcoal-800 mb-1">
                    {t.spareParts.partNoLabel}
                  </label>
                  <input
                    id="partNumber"
                    type="text"
                    value={form.partNumber}
                    onChange={(e) => setForm({ ...form, partNumber: e.target.value.toUpperCase() })}
                    placeholder={t.spareParts.partNoPlaceholder}
                    className="w-full px-3 py-2 bg-ivory-50 border border-borderBase rounded-sm text-xs text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-1 focus:ring-crimson-700 uppercase"
                  />
                </div>
              </div>

              {/* Part Description */}
              <div>
                <label htmlFor="partDescription" className="block text-xs font-semibold text-charcoal-800 mb-1">
                  {t.spareParts.partLabel}
                </label>
                <textarea
                  id="partDescription"
                  rows={3}
                  value={form.partDescription}
                  onChange={(e) => setForm({ ...form, partDescription: e.target.value })}
                  placeholder={t.spareParts.partPlaceholder}
                  className={`w-full px-3 py-2 bg-ivory-50 border rounded-sm text-xs text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-1 focus:ring-crimson-700 ${
                    errors.partDescription ? 'border-red-600 bg-red-50/30' : 'border-borderBase'
                  }`}
                  aria-invalid={Boolean(errors.partDescription)}
                  aria-describedby={errors.partDescription ? 'partDescription-error' : undefined}
                />
                {errors.partDescription && (
                  <p id="partDescription-error" className="text-[11px] text-red-600 mt-1">
                    {errors.partDescription}
                  </p>
                )}
              </div>

              {/* Urgency */}
              <div>
                <span className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                  {t.spareParts.urgencyLabel}
                </span>
                <div className="flex gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="urgency"
                      value="routine"
                      checked={form.urgency === 'routine'}
                      onChange={() => setForm({ ...form, urgency: 'routine' })}
                      className="text-crimson-700 focus:ring-crimson-700"
                    />
                    <span>{t.spareParts.urgencyRoutine}</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="urgency"
                      value="urgent"
                      checked={form.urgency === 'urgent'}
                      onChange={() => setForm({ ...form, urgency: 'urgent' })}
                      className="text-crimson-700 focus:ring-crimson-700"
                    />
                    <span>{t.spareParts.urgencyEmergency}</span>
                  </label>
                </div>
              </div>

              {/* Clear Explicit Notice */}
              <div className="p-3 bg-ivory-100 border border-borderBase rounded-sm flex items-start gap-2.5 text-xs text-charcoal-700">
                <AlertCircle className="w-4 h-4 text-crimson-700 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {t.spareParts.disclaimer}
                </p>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="btn-base w-full sm:w-auto px-6 py-2.5 bg-crimson-700 hover:bg-crimson-800 text-white font-semibold text-xs shadow-sm"
                >
                  {t.spareParts.submitBtn}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Genuine Spares Verification Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-ivory-100 border border-borderBase p-6 rounded-sm space-y-4">
            <h3 className="font-heading text-lg font-bold text-charcoal-950 border-b border-borderBase pb-2">
              {isHindi ? 'बजाज जेन्युइन पार्ट्स गारंटी' : 'Bajaj Genuine Quality'}
            </h3>

            <div className="text-xs text-charcoal-700 space-y-3 leading-relaxed">
              <div className="flex gap-2.5 items-start">
                <ShieldCheck className="w-4 h-4 text-crimson-700 flex-shrink-0 mt-0.5" />
                <p>
                  {isHindi
                    ? 'प्रत्येक पार्ट पर बजाज ऑटो का मूल होलोग्राम और सीरियल नंबर अंकित रहता है।'
                    : 'Authentic Bajaj hologram packaging ensuring factory-rated fitment and durability.'}
                </p>
              </div>
              <div className="flex gap-2.5 items-start">
                <Package className="w-4 h-4 text-crimson-700 flex-shrink-0 mt-0.5" />
                <p>
                  {isHindi
                    ? 'कम्यूटर, पल्सर, एवेंजर और डोमिनार के सभी फास्ट-मूविंग पार्ट्स नियमित उपलब्ध।'
                    : 'Fast-moving parts stocked: brake shoes, spark plugs, filters, drive chains, and control cables.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Counter Enquiry */}
          <div className="p-6 bg-charcoal-950 text-white rounded-sm space-y-3">
            <h4 className="font-heading text-base font-bold text-ivory-50">
              {isHindi ? 'सीधे स्टोर पर पूछताछ?' : 'Need Instant Shelf Check?'}
            </h4>
            <p className="text-xs text-charcoal-300 leading-relaxed">
              {isHindi
                ? 'विशाल गुप्ता को कॉल करके आवश्यक पार्ट की तुरंत उपलब्धता और कीमत जानें।'
                : 'Call our Kurawali store counter directly to verify stock on shelf before visiting.'}
            </p>
            <a
              href={DEALERSHIP_INFO.contact.phoneHref}
              className="btn-base w-full py-2.5 bg-crimson-700 hover:bg-crimson-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              {DEALERSHIP_INFO.contact.displayPhone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
