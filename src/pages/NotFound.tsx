import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const NotFound: React.FC = () => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white border border-borderBase p-8 rounded-sm text-center space-y-4">
        <div className="w-12 h-12 bg-crimson-50 text-crimson-700 flex items-center justify-center mx-auto rounded-sm">
          <AlertCircle className="w-6 h-6" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">Error 404</span>
        <h1 className="font-heading text-2xl font-bold text-charcoal-950">
          {isHindi ? 'पृष्ठ नहीं मिला' : 'Page Not Found'}
        </h1>
        <p className="text-xs text-charcoal-600 leading-relaxed">
          {isHindi
            ? 'अनुरोधित पृष्ठ मौजूद नहीं है या गुप्ता मोटर्स वेबसाइट पर स्थानांतरित कर दिया गया है।'
            : 'The requested route does not exist or has been relocated within the Gupta Motors system.'}
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="btn-base px-4 py-2 bg-charcoal-900 text-ivory-50 text-xs font-medium inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {isHindi ? 'मुख्य पृष्ठ पर वापस जाएं' : 'Return to Dealership Home'}
          </Link>
        </div>
      </div>
    </div>
  );
};
