import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FloatingButton: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Link
      to="/iniciar-projeto"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label={t.home.requestQuote}
    >
      <div className="bg-brand-red hover:bg-brand-red-hover text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <div className="bg-white/20 rounded-full p-2">
          <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <span className="hidden md:inline-block font-semibold text-sm sm:text-base pr-2">
          {t.home.requestQuote}
        </span>
        <ArrowRight className="h-4 w-4 hidden md:block group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};

export default FloatingButton;
