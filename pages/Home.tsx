// src/pages/Home.tsx

import React, { useState } from 'react';
import { ArrowRight, Code2, Users, ShieldCheck, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import ScrollReveal from '../components/ScrollReveal.tsx';
import { useLanguage } from '../contexts/LanguageContext';

const Home: React.FC = () => {
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({});
  const { t } = useLanguage();

  const toggleCard = (index: number) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleCardClick = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCard(index);
  };

  return (
    <div className="w-full">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-bg pt-16 pb-32 lg:pt-24 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="max-w-3xl">
              <span className="inline-block py-1 px-3 rounded-full bg-brand-blue/10 text-brand-blue text-sm font-semibold mb-6">
                {t.home.badge}
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-brand-blue mb-6 leading-tight">
                {t.home.title} <span className="text-brand-red">{t.home.titleHighlight}</span> {t.home.titleEnd}
              </h1>
              <p className="text-lg md:text-xl text-brand-slate mb-10 max-w-2xl leading-relaxed">
                {t.home.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/servicos">
                  <Button variant="primary" className="w-full sm:w-auto">
                    {t.home.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pillars Section (FLIP CARDS) */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* CARD 1 */}
            <ScrollReveal delay={0.1}>
              <div 
                className={`flip-card-container h-[250px] ${flippedCards[0] ? 'flipped' : ''}`}
                onClick={(e) => handleCardClick(e, 0)}
                onTouchEnd={(e) => handleCardClick(e, 0)}
              >
                <div className="benefit-card">
                  <div className="card-front flex flex-col items-center justify-center p-6 rounded-2xl bg-brand-bg border border-brand-slate/10 group">
                    <div className="bg-brand-blue p-3 rounded-lg mb-6">
                      <Code2 className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-brand-blue mb-3 text-center">
                      {t.home.card1Title}
                    </h3>
                  </div>
                  <div className="card-back flex flex-col items-center justify-center p-6 rounded-2xl">
                    <p className="text-white text-center">
                      {t.home.card1Desc}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* CARD 2 */}
            <ScrollReveal delay={0.3}>
              <div 
                className={`flip-card-container h-[250px] ${flippedCards[1] ? 'flipped' : ''}`}
                onClick={(e) => handleCardClick(e, 1)}
                onTouchEnd={(e) => handleCardClick(e, 1)}
              >
                <div className="benefit-card">
                  <div className="card-front flex flex-col items-center justify-center p-6 rounded-2xl bg-brand-bg border border-brand-slate/10 group">
                    <div className="bg-brand-blue p-3 rounded-lg mb-6">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-brand-blue mb-3 text-center">
                      {t.home.card2Title}
                    </h3>
                  </div>
                  <div className="card-back flex flex-col items-center justify-center p-6 rounded-2xl">
                    <p className="text-white text-center">
                      {t.home.card2Desc}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* CARD 3 */}
            <ScrollReveal delay={0.5}>
              <div 
                className={`flip-card-container h-[250px] ${flippedCards[2] ? 'flipped' : ''}`}
                onClick={(e) => handleCardClick(e, 2)}
                onTouchEnd={(e) => handleCardClick(e, 2)}
              >
                <div className="benefit-card">
                  <div className="card-front flex flex-col items-center justify-center p-6 rounded-2xl bg-brand-bg border border-brand-slate/10 group">
                    <div className="bg-brand-blue p-3 rounded-lg mb-6">
                      <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-brand-blue mb-3 text-center">
                      {t.home.card3Title}
                    </h3>
                  </div>
                  <div className="card-back flex flex-col items-center justify-center p-6 rounded-2xl">
                    <p className="text-white text-center">
                      {t.home.card3Desc}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-bg py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Rocket className="h-12 w-12 text-brand-red mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-blue mb-6">
            {t.home.ctaTitle}
          </h2>
          <p className="text-brand-slate text-lg">
            {t.home.ctaSubtitle}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
