import React from 'react';
import { Facebook, Linkedin, Mail, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-brand-blue text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center group mb-4 select-none">
              <div className="flex justify-center items-center py-2 pl-2 pr-0 rounded-lg transition-colors duration-300 flex-shrink-0">
                <img
                  src="/images/menu-icon.png"
                  alt="Logo Devmar"
                  className="h-[52px] w-[52px] object-contain"
                />
              </div>
              <div className="flex items-center pl-1">
                <span className="font-manrope font-semibold text-lg text-white tracking-tight">
                  DevMar
                </span>
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {t.footer.description}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-brand-red transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-brand-red transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-brand-red transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="text-white font-display font-bold mb-4">{t.footer.navigation}</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-brand-red transition-colors">{t.nav.home}</Link></li>
              <li><Link to="/sobre" className="hover:text-brand-red transition-colors">{t.nav.about}</Link></li>
              <li><Link to="/servicos" className="hover:text-brand-red transition-colors">{t.nav.services}</Link></li>
              <li><Link to="/contato" className="hover:text-brand-red transition-colors">{t.nav.contact}</Link></li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-white font-display font-bold mb-4">{t.footer.specialties}</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>{t.footer.webDev}</li>
              <li>{t.footer.lgpdConsulting}</li>
              <li>{t.footer.ai}</li>
              <li>{t.footer.cloud}</li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-display font-bold mb-4">{t.footer.contact}</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contato@devmar.com.br</span>
              </li>
              <li>{t.footer.location}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} DevMar. {t.footer.rights}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-brand-red">{t.footer.privacy}</a>
            <a href="#" className="hover:text-brand-red">{t.footer.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
