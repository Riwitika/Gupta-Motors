import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, AlertCircle, PhoneCall, MessageSquare, Wrench } from 'lucide-react';
import { DEALERSHIP_INFO } from '../../constants/business';
import { useLanguage } from '../../context/LanguageContext';
import { BAJAJ_MOTORCYCLES } from '../../data/bajajCatalogue';

interface FormState {
  customerName: string;
  customerPhone: string;
  bikeModel: string;
  registrationNumber: string;
  preferredDate: string;
  reportedIssue: string;
}

interface FormErrors {
  customerName?: string;
  customerPhone?: string;
  bikeModel?: string;
  preferredDate?: string;
  reportedIssue?: string;
}

export const ServiceBooking: React.FC = () => {
  const { language, t } = useLanguage();
  const isHindi = language === 'hi';

  const [form, setForm] = useState<FormState>({
    customerName: '',
    customerPhone: '',
    bikeModel: '',
    registrationNumber: '',
    preferredDate: '',
    reportedIssue: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedData, setSubmittedData] = useState<FormState | null>(null);

  const validate = (): boolean => {
    const errs: FormErrors = {};

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

    if (!form.preferredDate) {
      errs.preferredDate = t.validation.dateRequired;
    }

    if (!form.reportedIssue.trim()) {
      errs.reportedIssue = t.validation.issueRequired;
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
      registrationNumber: '',
      preferredDate: '',
      reportedIssue: '',
    });
    setErrors({});
    setSubmittedData(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-borderBase pb-6">
        <div className="text-xs text-charcoal-500 mb-2">
          <Link to="/" className="hover:text-charcoal-900">{t.nav.home}</Link> / <span>{t.nav.service}</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal-950">
          {t.serviceBooking.title}
        </h1>
        <p className="text-sm text-charcoal-600 mt-2 max-w-2xl leading-relaxed">
          {t.serviceBooking.subtitle}
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
                    {t.serviceBooking.successTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal-600 mt-1 leading-relaxed">
                    {t.serviceBooking.successDesc}
                  </p>
                </div>
              </div>

              {/* Logged Summary Details */}
              <div className="bg-ivory-50 border border-borderBase p-4 rounded-sm space-y-2 text-xs">
                <div className="font-bold text-charcoal-900 border-b border-borderBase pb-2 uppercase tracking-wider text-[11px]">
                  {isHindi ? 'अनुरोध सारांश' : 'Request Summary'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <p><span className="text-charcoal-500">{isHindi ? 'ग्राहक:' : 'Customer:'}</span> <strong>{submittedData.customerName}</strong></p>
                  <p><span className="text-charcoal-500">{isHindi ? 'फ़ोन:' : 'Phone:'}</span> <strong>{submittedData.customerPhone}</strong></p>
                  <p><span className="text-charcoal-500">{isHindi ? 'मॉडल:' : 'Model:'}</span> <strong>{submittedData.bikeModel}</strong></p>
                  <p><span className="text-charcoal-500">{isHindi ? 'पंजीकरण संख्या:' : 'Reg No:'}</span> <strong>{submittedData.registrationNumber || 'N/A'}</strong></p>
                  <p><span className="text-charcoal-500">{isHindi ? 'पसंदीदा तिथि:' : 'Date:'}</span> <strong>{submittedData.preferredDate}</strong></p>
                </div>
                <div className="pt-2 border-t border-borderBase">
                  <span className="text-charcoal-500">{isHindi ? 'समस्या विवरण:' : 'Reported Issue:'}</span>
                  <p className="mt-0.5 text-charcoal-800 font-medium">{submittedData.reportedIssue}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-base px-5 py-2.5 bg-charcoal-900 text-ivory-50 text-xs font-semibold"
                >
                  {t.serviceBooking.newRequestBtn}
                </button>
                <a
                  href={`${DEALERSHIP_INFO.contact.whatsAppHref}?text=${encodeURIComponent(`Hello Vishal Ji, I submitted a service request for ${submittedData.bikeModel} on ${submittedData.preferredDate} under name ${submittedData.customerName}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base px-5 py-2.5 bg-emerald-700 text-white text-xs font-semibold"
                >
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  {isHindi ? 'व्हाट्सएप पर पुष्टि करें' : 'Follow up on WhatsApp'}
                </a>
              </div>
            </div>
          ) : (
            /* Active Form */
            <form onSubmit={handleSubmit} className="bg-white border border-borderBase p-6 sm:p-8 rounded-sm shadow-sm space-y-6">
              <div className="flex items-center gap-2 border-b border-borderBase pb-3">
                <Wrench className="w-5 h-5 text-crimson-700" />
                <h2 className="font-heading text-xl font-bold text-charcoal-950">
                  {t.serviceBooking.formTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Name */}
                <div>
                  <label htmlFor="customerName" className="block text-xs font-semibold text-charcoal-800 mb-1">
                    {t.serviceBooking.nameLabel}
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder={t.serviceBooking.namePlaceholder}
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
                    {t.serviceBooking.phoneLabel}
                  </label>
                  <input
                    id="customerPhone"
                    type="tel"
                    maxLength={10}
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    placeholder={t.serviceBooking.phonePlaceholder}
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
                    {t.serviceBooking.modelLabel}
                  </label>
                  <select
                    id="bikeModel"
                    value={form.bikeModel}
                    onChange={(e) => setForm({ ...form, bikeModel: e.target.value })}
                    className={`w-full px-3 py-2 bg-ivory-50 border rounded-sm text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-crimson-700 ${
                      errors.bikeModel ? 'border-red-600 bg-red-50/30' : 'border-borderBase'
                    }`}
                    aria-invalid={Boolean(errors.bikeModel)}
                    aria-describedby={errors.bikeModel ? 'bikeModel-error' : undefined}
                  >
                    <option value="">-- {t.serviceBooking.modelPlaceholder} --</option>
                    {BAJAJ_MOTORCYCLES.map((bike) => (
                      <option key={bike.id} value={bike.name}>
                        {isHindi ? bike.hindiName : bike.name} ({bike.engineCc})
                      </option>
                    ))}
                    <option value="Other Bajaj Model">Other Bajaj Two-Wheeler</option>
                  </select>
                  {errors.bikeModel && (
                    <p id="bikeModel-error" className="text-[11px] text-red-600 mt-1">
                      {errors.bikeModel}
                    </p>
                  )}
                </div>

                {/* Registration Number */}
                <div>
                  <label htmlFor="registrationNumber" className="block text-xs font-semibold text-charcoal-800 mb-1">
                    {t.serviceBooking.regLabel}
                  </label>
                  <input
                    id="registrationNumber"
                    type="text"
                    value={form.registrationNumber}
                    onChange={(e) => setForm({ ...form, registrationNumber: e.target.value.toUpperCase() })}
                    placeholder={t.serviceBooking.regPlaceholder}
                    className="w-full px-3 py-2 bg-ivory-50 border border-borderBase rounded-sm text-xs text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-1 focus:ring-crimson-700 uppercase"
                  />
                </div>
              </div>

              {/* Preferred Date */}
              <div>
                <label htmlFor="preferredDate" className="block text-xs font-semibold text-charcoal-800 mb-1">
                  {t.serviceBooking.dateLabel}
                </label>
                <input
                  id="preferredDate"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={form.preferredDate}
                  onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                  className={`w-full sm:w-64 px-3 py-2 bg-ivory-50 border rounded-sm text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-crimson-700 ${
                    errors.preferredDate ? 'border-red-600 bg-red-50/30' : 'border-borderBase'
                  }`}
                  aria-invalid={Boolean(errors.preferredDate)}
                  aria-describedby={errors.preferredDate ? 'preferredDate-error' : undefined}
                />
                {errors.preferredDate && (
                  <p id="preferredDate-error" className="text-[11px] text-red-600 mt-1">
                    {errors.preferredDate}
                  </p>
                )}
              </div>

              {/* Reported Issue / Service Requirement */}
              <div>
                <label htmlFor="reportedIssue" className="block text-xs font-semibold text-charcoal-800 mb-1">
                  {t.serviceBooking.issueLabel}
                </label>
                <textarea
                  id="reportedIssue"
                  rows={3}
                  value={form.reportedIssue}
                  onChange={(e) => setForm({ ...form, reportedIssue: e.target.value })}
                  placeholder={t.serviceBooking.issuePlaceholder}
                  className={`w-full px-3 py-2 bg-ivory-50 border rounded-sm text-xs text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-1 focus:ring-crimson-700 ${
                    errors.reportedIssue ? 'border-red-600 bg-red-50/30' : 'border-borderBase'
                  }`}
                  aria-invalid={Boolean(errors.reportedIssue)}
                  aria-describedby={errors.reportedIssue ? 'reportedIssue-error' : undefined}
                />
                {errors.reportedIssue && (
                  <p id="reportedIssue-error" className="text-[11px] text-red-600 mt-1">
                    {errors.reportedIssue}
                  </p>
                )}
              </div>

              {/* Clear Explicit Disclaimer */}
              <div className="p-3 bg-ivory-100 border border-borderBase rounded-sm flex items-start gap-2.5 text-xs text-charcoal-700">
                <AlertCircle className="w-4 h-4 text-crimson-700 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {t.serviceBooking.disclaimer}
                </p>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="btn-base w-full sm:w-auto px-6 py-2.5 bg-crimson-700 hover:bg-crimson-800 text-white font-semibold text-xs shadow-sm"
                >
                  {t.serviceBooking.submitBtn}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Workshop Advice Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-ivory-100 border border-borderBase p-6 rounded-sm space-y-4">
            <h3 className="font-heading text-lg font-bold text-charcoal-950 border-b border-borderBase pb-2">
              {isHindi ? 'वर्कशॉप दिशा-निर्देश' : 'Workshop Checklist'}
            </h3>

            <div className="text-xs text-charcoal-700 space-y-3 leading-relaxed">
              <div className="flex gap-2.5 items-start">
                <Calendar className="w-4 h-4 text-crimson-700 flex-shrink-0 mt-0.5" />
                <p>
                  {isHindi
                    ? 'फ़्री सर्विस के लिए कृपया अपनी अधिकृत बजाज सर्विस बुक साथ अवश्य लाएं।'
                    : 'Please carry your original Bajaj Service Booklet & manual for warranty and free service coupons.'}
                </p>
              </div>
              <div className="flex gap-2.5 items-start">
                <Wrench className="w-4 h-4 text-crimson-700 flex-shrink-0 mt-0.5" />
                <p>
                  {isHindi
                    ? 'वर्कशॉप में केवल बजाज प्रमाणित 100% जेन्युइन पार्ट्स और ऑयल का उपयोग किया जाता है।'
                    : 'Only 100% factory-sealed Bajaj Genuine Parts and recommended engine oils are used.'}
                </p>
              </div>
            </div>
          </div>

          {/* Urgent Breakdown Advice */}
          <div className="p-6 bg-charcoal-950 text-white rounded-sm space-y-3">
            <h4 className="font-heading text-base font-bold text-ivory-50">
              {isHindi ? 'आपातकालीन मरम्मत या ब्रेकडाउन?' : 'Urgent Breakdown or Puncture?'}
            </h4>
            <p className="text-xs text-charcoal-300 leading-relaxed">
              {isHindi
                ? 'यदि आपकी मोटरसाइकिल स्टार्ट नहीं हो रही है या तत्काल सहायता की आवश्यकता है, तो सीधे कॉल करें।'
                : 'For roadside breakdowns near Kurawali or immediate intake, contact our workshop supervisor directly.'}
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
