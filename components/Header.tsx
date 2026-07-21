import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Sun, Moon, UserPlus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { languages, Language } from '../locales';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const NAV_ITEMS = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.about, path: '/sobre' },
    { label: t.nav.services, path: '/servicos' },
    { label: t.nav.contact, path: '/contato' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const isActive = (path: string) => location.pathname === path;

  const currentLang = languages.find(l => l.code === language);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setLangMenuOpen(false);
  };

  return (
    <header className="fixed w-full bg-brand-light/95 backdrop-blur-md z-50 border-b border-brand-slate/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center group h-20 select-none">
            <div className="flex items-center justify-center flex-shrink-0">
              <img
                src="/images/menu-icon.png"
                alt="Logo Devmar"
                className="h-11 sm:h-[52px] w-auto object-contain"
              />
            </div>

            <div className="flex flex-col justify-center items-start pl-1.5 sm:pl-2.5">
              <span className="font-manrope font-bold text-lg sm:text-[22px] text-[#1a1a1a] dark:text-white tracking-tight leading-[1.1]">
                DevMar
              </span>
              <span className="font-manrope font-light text-[7px] sm:text-[10px] text-[#1a1a1a] dark:text-gray-300 tracking-wide -mt-[1px] sm:-mt-[1.5px] leading-none">
                {t.home.badge}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 lg:space-x-8 items-center">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium whitespace-nowrap transition-colors duration-200 ${isActive(item.path)
                  ? 'text-brand-red font-semibold'
                  : 'text-brand-slate hover:text-brand-blue'
                  }`}
              >
                {item.label}
              </Link>
            ))}

            {/* CTA - Faça Parte */}
            <Link
              to="/quero-ser-cooperado"
              className={`flex items-center gap-2 text-sm font-semibold whitespace-nowrap px-4 py-2 rounded-lg transition-colors duration-200 ${isActive('/quero-ser-cooperado')
                ? 'bg-brand-red text-white shadow-sm'
                : 'bg-brand-red text-white hover:bg-brand-red/90'
                }`}
            >
              <UserPlus className="h-4 w-4" />
              {t.nav.joinUs}
            </Link>

            {/* Theme + Language - Desktop */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg text-lg font-medium text-brand-slate hover:text-brand-blue hover:bg-brand-bg transition-colors"
                aria-label="Alternar tema (claro/escuro)"
                title="Alternar tema"
                type="button"
              >
                {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </button>

              {/* Language Selector - Desktop */}
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg text-lg font-medium text-brand-slate hover:text-brand-blue hover:bg-brand-bg transition-colors"
                  aria-label="Select language"
                >
                  <Globe className="h-6 w-6" />
                  <span className="hidden lg:inline text-xl">{currentLang?.flag}</span>
                </button>

                {langMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setLangMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-brand-slate/10 py-1 z-50">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-brand-bg transition-colors ${language === lang.code ? 'text-brand-red font-medium' : 'text-brand-slate'
                            }`}
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </nav>

          {/* Mobile: Language + Theme + Menu Button */}
          <div className="md:hidden flex items-center gap-1.5">
            {/* Language Selector - Mobile */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 px-1.5 py-1 rounded-lg text-sm text-brand-slate hover:text-brand-blue transition-colors"
                aria-label="Select language"
              >
                <span className="text-xl">{currentLang?.flag}</span>
              </button>

              {langMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-brand-slate/10 py-1 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-brand-bg transition-colors ${language === lang.code ? 'text-brand-red font-medium' : 'text-brand-slate'
                          }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle - Mobile */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 px-1.5 py-1 rounded-lg text-sm text-brand-slate hover:text-brand-blue transition-colors"
              aria-label="Alternar tema (claro/escuro)"
              title="Alternar tema"
              type="button"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={toggleMenu}
              className="text-brand-blue hover:text-brand-red focus:outline-none"
              aria-label="Menu"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-brand-red" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(item.path)
                  ? 'text-brand-red bg-brand-bg'
                  : 'text-brand-slate hover:text-brand-blue hover:bg-gray-50'
                  }`}
              >
                {item.label}
              </Link>
            ))}

            {/* CTA - Faça Parte (Mobile) */}
            <Link
              to="/quero-ser-cooperado"
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-base font-semibold ${isActive('/quero-ser-cooperado')
                ? 'bg-brand-red text-white'
                : 'bg-brand-red text-white hover:bg-brand-red/90'
                }`}
            >
              <UserPlus className="h-5 w-5" />
              {t.nav.joinUs}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
